package com.swp391.service;

import com.swp391.dto.request.*;
import com.swp391.dto.response.DonationHistoryResponse;
import com.swp391.dto.response.RegisOfflineResponse;
import com.swp391.dto.response.RegisReceiveResponse;
import com.swp391.dto.response.TopDonorResponse;
import com.swp391.entity.*;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.DonationMapper;
import com.swp391.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
    BloodDonationFormRepository bloodDonationFormRepository;
    RegisOfflineRepository regisOfflineRepository;
    BloodInventoryRepository bloodInventoryRepository;
    EventRepository eventRepository;
    // ==== DonationHistory ====

    public DonationHistoryResponse createDonationHistory(DonationHistoryCreateRequest request) {
        DonationHistory donationHistory = donationMapper.toDonationHistory(request);

        // Set createdDate
        donationHistory.setCreatedDate(LocalDate.now());
        // ngày có thể hiến máu lại
        donationHistory.setNextEligibleDate(LocalDate.now().plusMonths(3));

        // Validate and set related entities
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));
        BloodDonationForm form = bloodDonationFormRepository.findById(request.getBloodDonationFormId())
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));


        donationHistory.setMember(member);
        donationHistory.setStaff(staff);
        donationHistory.setBloodType(bloodType);
        donationHistory.setBloodDonationForm(form);
        donationHistory.setEvent(event);

        donationHistory = donationHistoryRepository.save(donationHistory);

        // Cập nhật kho máu nếu kết quả đạt
        if ("Đạt".equalsIgnoreCase(donationHistory.getResult())) {
            BloodInventory bloodInventory = bloodInventoryRepository.findByBloodType_Id(donationHistory.getBloodType().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_INVENTORY_NOT_FOUND));
            bloodInventory.setQuantity(bloodInventory.getQuantity() + donationHistory.getVolume());
            bloodInventoryRepository.save(bloodInventory);
        }

        // Gửi thông báo cho member
        String message;
        if ("Đạt".equalsIgnoreCase(donationHistory.getResult())) {
            message = String.format(
                    "Chúc mừng! Kết quả xét nghiệm máu ngày %s của bạn đạt tiêu chuẩn. Vui lòng xem chi tiết trong lịch sử hiến máu.",
                    donationHistory.getCreatedDate()
            );
        } else {
            message = String.format(
                    "Rất tiếc, kết quả xét nghiệm máu ngày %s của bạn không đạt tiêu chuẩn (%s). Vui lòng đến cơ sở y tế để kiểm tra lại.",
                    donationHistory.getCreatedDate(),
                    donationHistory.getResult()
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

        // Validate and set related entities
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));
        BloodDonationForm form = bloodDonationFormRepository.findById(request.getBloodDonationFormId())
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        donationHistory.setMember(member);
        donationHistory.setStaff(staff);
        donationHistory.setBloodType(bloodType);
        donationHistory.setBloodDonationForm(form);

        donationHistory = donationHistoryRepository.save(donationHistory);

        // Gửi thông báo cho member (giữ nguyên logic)
        String message;
        if ("Đạt".equalsIgnoreCase(donationHistory.getResult())) {
            message = String.format(
                    "Cập nhật: Kết quả xét nghiệm máu ngày %s của bạn đạt tiêu chuẩn.",
                    donationHistory.getCreatedDate()
            );
        } else {
            message = String.format(
                    "Cập nhật: Kết quả xét nghiệm máu ngày %s của bạn không đạt (%s). Vui lòng kiểm tra sức khoẻ.",
                    donationHistory.getCreatedDate(),
                    donationHistory.getResult()
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

    public List<DonationHistoryResponse> getDonationHistoriesByMemberId(int memberId) {
        // Validate memberId
        if (!memberRepository.existsById(memberId)) {
            throw new AppException(ErrorCode.MEMBER_NOT_FOUND);
        }
        return donationHistoryRepository.findByMemberId(memberId)
                .stream()
                .map(donationMapper::toDonationHistoryResponse)
                .toList();
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

    public RegisOfflineResponse createRegisOffline(RegisOfflineRequest request) {
        // Validate staff
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        RegisOffline regisOffline = donationMapper.toRegisOffline(request);
        regisOffline.setStaff(staff);
        regisOffline.setCreatedAt(LocalDate.now());
        regisOffline.setStatus("APPROVED"); // Mặc định trạng thái là PENDING khi tạo

        regisOffline = regisOfflineRepository.save(regisOffline);
        return donationMapper.toRegisOfflineResponse(regisOffline);
    }

    public RegisOfflineResponse updateRegisOffline(int id, RegisOfflineUpdateRequest request) {
        RegisOffline regisOffline = regisOfflineRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DONATION_REGISTRATION_OFFLINE_NOT_EXISTED));

        // Validate staff
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        // Cập nhật thông tin từ request
        donationMapper.updateRegisOffline(regisOffline, request);
        regisOffline.setStaff(staff);
        regisOffline.setBloodType(request.getBloodType());
        regisOffline.setVolumeMl(request.getVolumeMl());
        regisOffline.setResult(request.getResult());
        regisOffline.setStatus(request.getStatus().toUpperCase());

        regisOffline = regisOfflineRepository.save(regisOffline);
        return donationMapper.toRegisOfflineResponse(regisOffline);
    }

    public RegisOfflineResponse getRegisOfflineById(int id) {
        RegisOffline regisOffline = regisOfflineRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DONATION_REGISTRATION_OFFLINE_NOT_EXISTED));
        return donationMapper.toRegisOfflineResponse(regisOffline);
    }

    public List<RegisOfflineResponse> getAllRegisOffline() {
        return regisOfflineRepository.findAll()
                .stream()
                .map(donationMapper::toRegisOfflineResponse)
                .toList();
    }

    public void deleteRegisOffline(int id) {
        if (!regisOfflineRepository.existsById(id)) {
            throw new AppException(ErrorCode.DONATION_REGISTRATION_OFFLINE_NOT_EXISTED);
        }
        regisOfflineRepository.deleteById(id);
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

    public List<TopDonorResponse> getTopDonors(int limit) {
        return donationHistoryRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        history -> history.getMember(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                histories -> TopDonorResponse.builder()
                                        .memberId(histories.get(0).getMember().getId())
                                        .memberName(histories.get(0).getMember().getName())
                                        .totalVolume(histories.stream()
                                                .mapToInt(DonationHistory::getVolume)
                                                .sum())
                                        .donationCount(histories.size())
                                        .build()
                        )
                ))
                .values()
                .stream()
                .sorted(Comparator.comparing(TopDonorResponse::getTotalVolume).reversed())
                .limit(limit)
                .toList();
    }

    // Total volume of blood donated by a member
    public int getTotalVolumeByMemberId(int memberId) {
        return donationHistoryRepository.findByMemberId(memberId)
                .stream()
                .mapToInt(DonationHistory::getVolume)
                .sum();
    }

}
