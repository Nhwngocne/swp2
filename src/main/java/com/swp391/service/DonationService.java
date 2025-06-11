package com.swp391.service;

import com.swp391.dto.request.DonationHistoryCreateRequest;
import com.swp391.dto.request.DonationRegistrationRequest;
import com.swp391.dto.request.RegisReceiveRequest;
import com.swp391.dto.response.DonationHistoryResponse;
import com.swp391.dto.response.RegisOfflineResponse;
import com.swp391.dto.response.RegisReceiveResponse;
import com.swp391.entity.BloodType;
import com.swp391.entity.DonationHistory;
import com.swp391.entity.DonationRegistration;
import com.swp391.entity.RegisReceive;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.DonationMapper;
import com.swp391.repository.BloodTypeRepository;
import com.swp391.repository.DonationHistoryRepository;
import com.swp391.repository.DonationRegistrationRepository;
import com.swp391.repository.RegisReceiveRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DonationService {

    DonationHistoryRepository donationHistoryRepository;
    DonationRegistrationRepository donationRegistrationRepository;
    RegisReceiveRepository regisReceiveRepository;
    DonationMapper donationMapper;
    BloodTypeRepository bloodTypeRepository;


    // ==== DonationHistory ====

    public DonationHistoryResponse createDonationHistory(DonationHistoryCreateRequest request) {
        DonationHistory donationHistory = donationMapper.toDonationHistory(request);
        donationHistory = donationHistoryRepository.save(donationHistory);
        return donationMapper.toDonationHistoryResponse(donationHistory);
    }

    public DonationHistoryResponse getDonationHistoryById(int id) {
        DonationHistory donationHistory = donationHistoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_HISTORY_NOT_EXISTED));
        return donationMapper.toDonationHistoryResponse(donationHistory);
    }

    public List<DonationHistoryResponse> getAllDonationHistories() {
        return donationHistoryRepository.findAll()
                .stream()
                .map(donationMapper::toDonationHistoryResponse)
                .toList();
    }

    public DonationHistoryResponse updateDonationHistory(int id, DonationHistoryCreateRequest request) {
        DonationHistory donationHistory = donationHistoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_HISTORY_NOT_EXISTED));
        donationMapper.updateDonationHistory(donationHistory, request);
        donationHistory = donationHistoryRepository.save(donationHistory);
        return donationMapper.toDonationHistoryResponse(donationHistory);
    }

    public void deleteDonationHistory(int id) {
        if (!donationHistoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.Donation_HISTORY_NOT_EXISTED);
        }
        donationHistoryRepository.deleteById(id);
    }

    // ==== DonationRegistration ====

    public void createDonationRegistration(DonationRegistrationRequest request) {
        DonationRegistration registration = donationMapper.toDonationRegistration(request);
        donationRegistrationRepository.save(registration);
    }

    public void updateDonationRegistration(int id, DonationRegistrationRequest request) {
        DonationRegistration registration = donationRegistrationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_REGISTRATION_NOT_EXISTED));
        donationMapper.updateDonationRegistration(registration, request);
        donationRegistrationRepository.save(registration);
    }

    public void deleteDonationRegistration(int id) {
        if (!donationRegistrationRepository.existsById(id)) {
            throw new AppException(ErrorCode.Donation_REGISTRATION_NOT_EXISTED);
        }
        donationRegistrationRepository.deleteById(id);
    }

    // ==== RegisOffline ====

    public RegisOfflineResponse createRegisOffline(RegisReceiveRequest request) {
        // Lấy entity từ DB bằng code
        BloodType bloodType = bloodTypeRepository.findByName(request.getBloodType())
                .orElseThrow(() -> new AppException(ErrorCode.Donation_REGISTRATION_OFFLINE_NOT_EXISTED));

        RegisReceive receive = donationMapper.toRegisReceive(request);
        receive.setBloodType(bloodType);  // set thủ công sau khi map
        receive = regisReceiveRepository.save(receive);

        return donationMapper.toRegisOfflineResponse(receive);
    }


    public RegisOfflineResponse getRegisOfflineById(int id) {
        RegisReceive receive = regisReceiveRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_REGISTRATION_OFFLINE_NOT_EXISTED));
        return donationMapper.toRegisOfflineResponse(receive);
    }

    public List<RegisOfflineResponse> getAllRegisOffline() {
        return regisReceiveRepository.findAll()
                .stream()
                .map(donationMapper::toRegisOfflineResponse)
                .toList();
    }

    public RegisOfflineResponse updateRegisOffline(int id, RegisReceiveRequest request) {
        RegisReceive receive = regisReceiveRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_REGISTRATION_OFFLINE_NOT_EXISTED));
        donationMapper.updateRegisReceive(receive, request);
        receive = regisReceiveRepository.save(receive);
        return donationMapper.toRegisOfflineResponse(receive);
    }

    public void deleteRegisOffline(int id) {
        if (!regisReceiveRepository.existsById(id)) {
            throw new AppException(ErrorCode.Donation_REGISTRATION_OFFLINE_NOT_EXISTED);
        }
        regisReceiveRepository.deleteById(id);
    }

    // ==== RegisReceive from DonationRegistration ====

    public RegisReceiveResponse createRegisReceiveFromRegistration(DonationRegistrationRequest request) {
        RegisReceive receive = donationMapper.toRegisReceive(request);
        receive = regisReceiveRepository.save(receive);
        return donationMapper.toRegisReceiveResponse(receive);
    }

    public RegisReceiveResponse getRegisReceiveById(int id) {
        RegisReceive receive = regisReceiveRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_RECEIVE_NOT_EXISTED));
        return donationMapper.toRegisReceiveResponse(receive);
    }

    public void deleteRegisReceive(int id) {
        if (!regisReceiveRepository.existsById(id)) {
            throw new AppException(ErrorCode.Donation_RECEIVE_NOT_EXISTED);
        }
        regisReceiveRepository.deleteById(id);
    }

    public RegisReceiveResponse updateRegisReceiveFromRegistration(int id, DonationRegistrationRequest request) {
        RegisReceive receive = regisReceiveRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Donation_RECEIVE_NOT_EXISTED));
        donationMapper.updateRegisReceive(receive, request);
        receive = regisReceiveRepository.save(receive);
        return donationMapper.toRegisReceiveResponse(receive);
    }
}
