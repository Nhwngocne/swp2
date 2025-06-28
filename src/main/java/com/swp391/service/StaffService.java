package com.swp391.service;

import com.swp391.dto.request.NotificationRequest;
import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.dto.response.StaffResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.BloodIntentForm;
import com.swp391.entity.Member;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BloodIntentFormMapper;
import com.swp391.mapper.StaffMapper;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.BloodIntentFormRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.StaffRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffService {

    StaffRepository staffRepository;
    AdminRepository adminRepository;
    StaffMapper staffMapper;
    PasswordEncoder passwordEncoder;
    MemberRepository memberRepository;
    BloodIntentFormRepository intentFormRepository;
    BloodIntentFormMapper bloodIntentFormMapper;
    NotificationService notificationService;
    BloodService bloodService;

    // -------------------------------
    // Create staff
    // -------------------------------
    public StaffResponse createStaff(StaffCreateRequest request) {
        Staff staff = staffMapper.toStaff(request);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        staff.setStatus("ACTIVE");

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        staff.setAdmin(admin);

        try {
            staff = staffRepository.save(staff);
        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return staffMapper.toStaffResponse(staff);
    }

    // -------------------------------
    // Update staff
    // -------------------------------
    public StaffResponse updateStaff(int id, StaffCreateRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        staffMapper.updateStaff(staff, request);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        staff.setAdmin(admin);

        staff = staffRepository.save(staff);
        return staffMapper.toStaffResponse(staff);
    }

    // -------------------------------
    // Delete staff
    // -------------------------------
    public void deleteStaff(int id) {
        staffRepository.deleteById(id);
    }

    // -------------------------------
    // Get all staff
    // -------------------------------
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(staffMapper::toStaffResponse)
                .toList();
    }

    // -------------------------------
    // Get staff by ID
    // -------------------------------
    public StaffResponse getStaffById(int id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return staffMapper.toStaffResponse(staff);
    }

    // -------------------------------
    // Ban or unban member
    // -------------------------------
    public void banMember(int memberId) {
        String staffName = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByEmail(staffName)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if ("ACTIVE".equalsIgnoreCase(member.getStatus())) {
            member.setStatus("BANNED");
        } else {
            member.setStatus("ACTIVE");
        }

        memberRepository.save(member);
    }

    // -------------------------------
    // Approve form
    // -------------------------------
    @Transactional
    public BloodIntentFormResponse approveForm(int formId) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        // Giả sử bạn lấy type & quantity từ form
        String bloodType = form.getBloodType();
        int quantityNeeded = form.getQuantity();

        boolean available = bloodService.checkBloodInventory(bloodType, quantityNeeded);

        if (available) {
            // Đủ máu -> hoàn thành
            form.setStatus("COMPLETED");
            form.setApprovedAt(LocalDate.now());

            String message = String.format(
                    "Yêu cầu %s máu của bạn đã sẵn sàng. Hãy đến Trung Tâm Hiến Máu XYZ để nhận.",
                    form.getIntentType()
            );

            NotificationRequest request = NotificationRequest.builder()
                    .memberId(form.getMember().getId())
                    .title("Thông báo nhận máu")
                    .message(message)
                    .build();
            notificationService.createNotificationForMember(request.getMemberId(), message);

        } else {
            // Chỉ duyệt, chưa đủ máu
            form.setStatus("ACCEPT");
            form.setApprovedAt(LocalDate.now());
        }

        return bloodIntentFormMapper.toResponse(form);
    }

    // -------------------------------
    // Reject form + notify member
    // -------------------------------
    @Transactional
    public BloodIntentFormResponse rejectForm(int formId, String reason) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        form.setStatus("REJECT");
        form.setRejectReason(reason);

        String message = String.format(
                "Yêu cầu %s máu của bạn đã bị từ chối. Lý do: %s",
                form.getIntentType(), reason
        );

        NotificationRequest request = NotificationRequest.builder()
                .memberId(form.getMember().getId())
                .title("Thông báo từ hệ thống")
                .message(message)
                .build();

        notificationService.createNotificationForMember(request.getMemberId(), message);

        return bloodIntentFormMapper.toResponse(form);
    }

}
