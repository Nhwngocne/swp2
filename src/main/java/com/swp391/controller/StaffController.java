package com.swp391.controller;

import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.dto.response.StaffResponse;
import com.swp391.service.StaffService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffController {

    StaffService staffService;

    // Create staff
    @PostMapping
    public ApiResponse<StaffResponse> createStaff(@RequestBody @Valid StaffCreateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.createStaff(request))
                .build();
    }

    // Update staff
    @PutMapping("/{staffId}")
    public ApiResponse<StaffResponse> updateStaff(
            @PathVariable int staffId,
            @RequestBody @Valid StaffCreateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.updateStaff(staffId, request))
                .build();
    }

    // Delete staff
    @DeleteMapping("/{staffId}")
    public ApiResponse<String> deleteStaff(@PathVariable int staffId) {
        staffService.deleteStaff(staffId);
        return ApiResponse.<String>builder()
                .result("Staff has been deleted")
                .build();
    }

    // Get all staff
    @GetMapping
    public ApiResponse<List<StaffResponse>> getAllStaff() {
        return ApiResponse.<List<StaffResponse>>builder()
                .result(staffService.getAllStaff())
                .build();
    }

    // Get staff by id
    @GetMapping("/{staffId}")
    public ApiResponse<StaffResponse> getStaffById(@PathVariable int staffId) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.getStaffById(staffId))
                .build();
    }

    // Ban or unban member
    @PatchMapping("/status/{memberId}")
    public ApiResponse<String> banStaff(@PathVariable int memberId) {
        staffService.banMember(memberId);
        return ApiResponse.<String>builder()
                .result("Member status has been changed by staff.")
                .build();
    }

    // Approve form
    @PostMapping("/blood-intent-forms/{formId}/approve")
    public ApiResponse<BloodIntentFormResponse> approveForm(@PathVariable int formId) {
        return ApiResponse.<BloodIntentFormResponse>builder()
                .result(staffService.approveForm(formId))
                .build();
    }

    // Reject form
    @PostMapping("/blood-intent-forms/{formId}/reject")
    public ApiResponse<BloodIntentFormResponse> rejectForm(
            @PathVariable int formId,
            @RequestParam @NotBlank String reason) {
        return ApiResponse.<BloodIntentFormResponse>builder()
                .result(staffService.rejectForm(formId, reason))
                .build();
    }
}
