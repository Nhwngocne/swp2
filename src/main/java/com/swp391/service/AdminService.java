package com.swp391.service;

import com.swp391.dto.request.AdminCreateRequest;
import com.swp391.dto.response.AdminResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.AdminMapper;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {
    AdminRepository adminRepository;
    AdminMapper adminMapper;
    PasswordEncoder passwordEncoder;
    StaffRepository staffRepository;
    // Create admin
    public AdminResponse createAdmin(AdminCreateRequest request) {
        Admin admin = adminMapper.toAdmin(request);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        try {
            admin = adminRepository.save(admin);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return adminMapper.toAdminResponse(admin);
    }

    // Update admin
    public AdminResponse updateAdmin(AdminCreateRequest request, int id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        adminMapper.updateAdmin(admin, request);
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        return adminMapper.toAdminResponse(admin);
    }

    // Delete admin
    public void deleteAdmin(int id) {
        adminRepository.deleteById(id);
    }

    // Get all admins
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(adminMapper::toAdminResponse)
                .toList();
    }

    // Get admin by id
    public AdminResponse getAdminById(int id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return adminMapper.toAdminResponse(admin);
    }

    public void bannerStaff(int staffId) {
        // 1. Lấy adminEmail từ token
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Kiểm tra admin có tồn tại
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 3. Tìm Staff theo ID
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        // 4. Toggle status
        if ("ACTIVE".equalsIgnoreCase(staff.getStatus())) {
            staff.setStatus("BANNED");
        } else {
            staff.setStatus("ACTIVE");
        }

        staffRepository.save(staff);
    }


}
