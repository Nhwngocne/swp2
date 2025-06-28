package com.swp391.service;

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
import java.time.LocalDateTime;
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
    // Create staff
    public StaffResponse createStaff(StaffCreateRequest request) {
        // 1. Convert request -> entity
        Staff staff = staffMapper.toStaff(request);

        // 2. Encode password
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        // Status
        staff.setStatus("ACTIVE");
        // 3. Tìm Admin từ adminId và set vào Staff
        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        staff.setAdmin(admin);

        try {
            // 4. Lưu staff
            staff = staffRepository.save(staff);
        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return staffMapper.toStaffResponse(staff);
    }

    // Update staff
    public StaffResponse updateStaff(int id, StaffCreateRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        staffMapper.updateStaff(staff, request);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        // Nếu cần cập nhật lại adminId
        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        staff.setAdmin(admin);

        staff = staffRepository.save(staff);
        return staffMapper.toStaffResponse(staff);
    }

    // Delete staff
    public void deleteStaff(int id) {
        staffRepository.deleteById(id);
    }

    // Get all staff
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(staffMapper::toStaffResponse)
                .toList();
    }

    // Get staff by ID
    public StaffResponse getStaffById(int id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return staffMapper.toStaffResponse(staff);
    }
    public void banMember(int memberId) {
        // 1. Lấy email staff đang đăng nhập từ token (SecurityContext)
        String staffName = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Kiểm tra staff tồn tại
        Staff staff = staffRepository.findByEmail(staffName)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 3. Tìm member cần ban
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 4. Toggle trạng thái
        if ("ACTIVE".equalsIgnoreCase(member.getStatus())) {
            member.setStatus("BANNED");
        } else {
            member.setStatus("ACTIVE");
        }

        // 5. Lưu lại
        memberRepository.save(member);
    }
    @Transactional
    public BloodIntentFormResponse approveForm(int formId) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        form.setStatus("ACCEPT");
        form.setApprovedAt(LocalDate.now());
        return bloodIntentFormMapper.toResponse(form);
    }

    @Transactional
    public BloodIntentFormResponse rejectForm(int formId, String reason) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        form.setStatus("REJECT");
        form.setRejectReason(reason);
        return bloodIntentFormMapper.toResponse(form);
    }


}
