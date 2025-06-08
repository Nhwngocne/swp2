package com.swp391.service;

import com.swp391.dto.request.EmergencyRequestCreateRequest;
import com.swp391.dto.response.EmergencyResponse;
import com.swp391.dto.response.NearbyDonorResponse;
import com.swp391.entity.EmergencyRequest;
import com.swp391.entity.NearbyDonor;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.EmergencyMapper;
import com.swp391.repository.EmergencyRequestRepository;
import com.swp391.repository.NearbyDonorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmergencyService {

    EmergencyRequestRepository emergencyRequestRepository;
    NearbyDonorRepository nearbyDonorRepository;
    EmergencyMapper emergencyMapper;

    // ==== EmergencyRequest ====

    public EmergencyResponse createEmergencyRequest(EmergencyRequestCreateRequest request) {
        EmergencyRequest emergencyRequest = emergencyMapper.toEmergencyRequest(request);
        emergencyRequest = emergencyRequestRepository.save(emergencyRequest);
        return emergencyMapper.toEmergencyResponse(emergencyRequest);
    }

    public EmergencyResponse getEmergencyRequestById(int id) {
        EmergencyRequest emergencyRequest = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMERGENCY_NOT_EXISTED));
        return emergencyMapper.toEmergencyResponse(emergencyRequest);
    }

    public List<EmergencyResponse> getAllEmergencyRequests() {
        return emergencyRequestRepository.findAll()
                .stream()
                .map(emergencyMapper::toEmergencyResponse)
                .toList();
    }

    public EmergencyResponse updateEmergencyRequest(int id, EmergencyRequestCreateRequest request) {
        EmergencyRequest emergencyRequest = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMERGENCY_NOT_EXISTED));
        emergencyMapper.toEmergencyRequest(request); // Nếu muốn update, cần map update, hoặc làm thủ công
        // Nếu bạn có method update trong mapper, gọi ở đây, ví dụ:
        // emergencyMapper.updateEmergencyRequest(emergencyRequest, request);
        // Nếu không có, bạn cần update thủ công từng trường ở đây.

        // Giả sử bạn có method updateEmergencyRequest trong mapper:
        // emergencyMapper.updateEmergencyRequest(emergencyRequest, request);

        emergencyRequest = emergencyRequestRepository.save(emergencyRequest);
        return emergencyMapper.toEmergencyResponse(emergencyRequest);
    }

    public void deleteEmergencyRequest(int id) {
        emergencyRequestRepository.deleteById(id);
    }

    // ==== NearbyDonor ====

    public List<NearbyDonorResponse> getAllNearbyDonors() {
        return nearbyDonorRepository.findAll()
                .stream()
                .map(emergencyMapper::toNearbyDonorResponse)
                .toList();
    }

    public NearbyDonorResponse getNearbyDonorById(int id) {
        NearbyDonor nearbyDonor = nearbyDonorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEAR_BY_DONOR_NOT_EXISTED));
        return emergencyMapper.toNearbyDonorResponse(nearbyDonor);
    }

    // Nếu bạn cần thêm các phương thức thao tác khác với NearbyDonor, hãy bổ sung ở đây.

}
