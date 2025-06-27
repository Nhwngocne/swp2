package com.swp391.controller;

import com.swp391.dto.request.AdminCreateRequest;
import com.swp391.dto.response.AdminResponse;
import com.swp391.dto.response.ApiResponse;
import com.swp391.service.AdminService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    AdminService adminService;

    // Create admin
    @PostMapping
    public ApiResponse<AdminResponse> createAdmin(@RequestBody @Valid AdminCreateRequest request) {
        return ApiResponse.<AdminResponse>builder()
                .result(adminService.createAdmin(request))
                .build();
    }

    // Update admin
    @PutMapping("/{adminId}")
    public ApiResponse<AdminResponse> updateAdmin(
            @PathVariable int adminId,
            @RequestBody @Valid AdminCreateRequest request) {
        return ApiResponse.<AdminResponse>builder()
                .result(adminService.updateAdmin(request, adminId))
                .build();
    }

    // Delete admin
    @DeleteMapping("/{adminId}")
    public ApiResponse<String> deleteAdmin(@PathVariable int adminId) {
        adminService.deleteAdmin(adminId);
        return ApiResponse.<String>builder()
                .result("Admin has been deleted")
                .build();
    }

    // Get all admins
    @GetMapping
    public ApiResponse<List<AdminResponse>> getAllAdmins() {
        return ApiResponse.<List<AdminResponse>>builder()
                .result(adminService.getAllAdmins())
                .build();
    }

    // Get admin by ID
    @GetMapping("/{adminId}")
    public ApiResponse<AdminResponse> getAdminById(@PathVariable int adminId) {
        return ApiResponse.<AdminResponse>builder()
                .result(adminService.getAdminById(adminId))
                .build();
    }
    @PatchMapping("/staff/{staffId}")
    public ApiResponse<String> banStaff(@PathVariable int staffId) {
        adminService.bannerStaff(staffId);
        return ApiResponse.<String>builder()
                .result("Status has been changed by staff.")
                .build();
    }
    @PatchMapping("/member/{memberId}")
    public ApiResponse<String> banMember(@PathVariable int memberId) {
        adminService.bannerMember(memberId);
        return ApiResponse.<String>builder()
                .result("Status has been changed by staff.")
                .build();
    }

}
