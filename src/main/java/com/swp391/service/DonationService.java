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
import com.swp391.entity.Member;
import com.swp391.entity.RegisReceive;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.DonationMapper;
import com.swp391.repository.BloodTypeRepository;
import com.swp391.repository.DonationHistoryRepository;
import com.swp391.repository.DonationRegistrationRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.RegisReceiveRepository;
import com.swp391.repository.StaffRepository;
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
    MemberRepository memberRepository;
    StaffRepository staffRepository;
    NotificationService notificationService;
    // ==== DonationHistory ====

    public DonationHistoryResponse createDonationHistory(DonationHistoryCreateRequest request) {
        DonationHistory donationHistory = donationMapper.toDonationHistory(request);

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));

        donationHistory.setMember(member);
        donationHistory.setStaff(staff);
        donationHistory.setBloodType(bloodType);

        donationHistory = donationHistoryRepository.save(donationHistory);

        // Sau khi lưu, gửi thông báo cho member
        String message;
        if ("Đạt tiêu chuẩn".equalsIgnoreCase(donationHistory.getTestResult())) {
            message = String.format(
                    "Chúc mừng! Kết quả xét nghiệm máu ngày %s của bạn đạt tiêu chuẩn. Vui lòng xem chi tiết trong lịch sử hiến máu.",
                    donationHistory.getDate()
            );
        } else {
            message = String.format(
                    "Rất tiếc, kết quả xét nghiệm máu ngày %s của bạn không đạt tiêu chuẩn (%s). Vui lòng đến cơ sở y tế để kiểm tra lại.",
                    donationHistory.getDate(),
                    donationHistory.getTestResult()
            );
        }

        notificationService.createNotificationForMember(member.getId(), message);

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

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));

        donationHistory.setMember(member);
        donationHistory.setStaff(staff);
        donationHistory.setBloodType(bloodType);

        donationHistory = donationHistoryRepository.save(donationHistory);

        String message;
        if ("Đạt tiêu chuẩn".equalsIgnoreCase(donationHistory.getTestResult())) {
            message = String.format(
                    "Cập nhật: Kết quả xét nghiệm máu ngày %s của bạn đạt tiêu chuẩn.",
                    donationHistory.getDate()
            );
        } else {
            message = String.format(
                    "Cập nhật: Kết quả xét nghiệm máu ngày %s của bạn không đạt (%s). Vui lòng kiểm tra sức khoẻ.",
                    donationHistory.getDate(),
                    donationHistory.getTestResult()
            );
        }

        notificationService.createNotificationForMember(member.getId(), message);

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
        BloodType bloodType = bloodTypeRepository.findByName(request.getBloodType())
                .orElseThrow(() -> new AppException(ErrorCode.Donation_REGISTRATION_OFFLINE_NOT_EXISTED));

        RegisReceive receive = donationMapper.toRegisReceive(request);
        receive.setBloodType(bloodType);
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
