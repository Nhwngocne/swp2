package com.swp391.service;

import com.swp391.dto.request.AdminCreateRequest;
import com.swp391.dto.response.AdminResponse;
import com.swp391.entity.Admin;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.AdminMapper;
import com.swp391.repository.AdminRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
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
}
