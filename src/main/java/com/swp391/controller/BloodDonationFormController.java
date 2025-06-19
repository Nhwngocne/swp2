package com.swp391.controller;

import com.swp391.dto.request.BloodDonationFormCreateRequest;

import com.swp391.dto.request.BloodDonationFormUpdateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BloodDonationFormResponse;
import com.swp391.service.BloodDonationFormService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodDonationFormController {

    BloodDonationFormService formService;

    // Create new form (member đăng ký)
    @PostMapping
    public ApiResponse<BloodDonationFormResponse> createForm(
            @RequestBody @Valid BloodDonationFormCreateRequest request) {
        return ApiResponse.<BloodDonationFormResponse>builder()
                .result(formService.createForm(request))
                .build();
    }

    // Staff update (duyệt đơn, cập nhật tình trạng)
    @PutMapping("/approve")
    public ApiResponse<BloodDonationFormResponse> updateFormByStaff(
            @RequestBody @Valid BloodDonationFormUpdateRequest request) {
        return ApiResponse.<BloodDonationFormResponse>builder()
                .result(formService.updateForm(request))
                .build();
    }

    // Member update form nếu chưa được duyệt
    @PutMapping("/{formId}/member/{memberId}")
    public ApiResponse<BloodDonationFormResponse> updateFormByMember(
            @PathVariable int formId,
            @PathVariable int memberId,
            @RequestBody @Valid BloodDonationFormUpdateRequest request) {
        return ApiResponse.<BloodDonationFormResponse>builder()
                .result(formService.memberUpdateForm(formId, memberId, request))
                .build();
    }

    // Delete form
    @DeleteMapping("/{formId}")
    public ApiResponse<String> deleteForm(@PathVariable int formId) {
        formService.deleteForm(formId);
        return ApiResponse.<String>builder()
                .result("Form has been deleted")
                .build();
    }

    // Get all forms
    @GetMapping
    public ApiResponse<List<BloodDonationFormResponse>> getAllForms() {
        return ApiResponse.<List<BloodDonationFormResponse>>builder()
                .result(formService.getAllForms())
                .build();
    }

    // Get form by ID
    @GetMapping("/{formId}")
    public ApiResponse<BloodDonationFormResponse> getFormById(@PathVariable int formId) {
        return ApiResponse.<BloodDonationFormResponse>builder()
                .result(formService.getFormById(formId))
                .build();
    }

    // Get all forms of a specific member
    @GetMapping("/member/{memberId}")
    public ApiResponse<List<BloodDonationFormResponse>> getFormsByMember(@PathVariable int memberId) {
        return ApiResponse.<List<BloodDonationFormResponse>>builder()
                .result(formService.getFormsByMemberId(memberId))
                .build();
    }

    // Get a specific form of member
    @GetMapping("/{formId}/member/{memberId}")
    public ApiResponse<BloodDonationFormResponse> getFormByMember(
            @PathVariable int formId,
            @PathVariable int memberId) {
        return ApiResponse.<BloodDonationFormResponse>builder()
                .result(formService.getFormByIdAndMember(formId, memberId))
                .build();
    }

    // Get all forms of an event
    @GetMapping("/event/{eventId}")
    public ApiResponse<List<BloodDonationFormResponse>> getFormsByEvent(@PathVariable int eventId) {
        return ApiResponse.<List<BloodDonationFormResponse>>builder()
                .result(formService.getFormsByEvent(eventId))
                .build();
    }
}
