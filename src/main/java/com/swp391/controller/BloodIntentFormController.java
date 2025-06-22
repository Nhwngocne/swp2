package com.swp391.controller;

import com.swp391.dto.request.BloodIntentFormRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.service.BloodIntentFormService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/intents")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class BloodIntentFormController {

    BloodIntentFormService intentFormService;

    // MEMBER đăng ký ý định hiến/nhận máu
    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ApiResponse<BloodIntentFormResponse> create(@RequestBody BloodIntentFormRequest request) {
        return ApiResponse.<BloodIntentFormResponse>builder()
                .result(intentFormService.create(request))
                .build();
    }

    // STAFF xem toàn bộ form
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<List<BloodIntentFormResponse>> getAll() {
        return ApiResponse.<List<BloodIntentFormResponse>>builder()
                .result(intentFormService.getAll())
                .build();
    }

    // STAFF xem form theo member
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<List<BloodIntentFormResponse>> getByMember(@PathVariable int memberId) {
        return ApiResponse.<List<BloodIntentFormResponse>>builder()
                .result(intentFormService.getByMember(memberId))
                .build();
    }

    // STAFF xem chi tiết 1 form
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<BloodIntentFormResponse> getById(@PathVariable int id) {
        return ApiResponse.<BloodIntentFormResponse>builder()
                .result(intentFormService.getById(id))
                .build();
    }

    // STAFF xoá form
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<String> delete(@PathVariable int id) {
        intentFormService.deleteById(id);
        return ApiResponse.<String>builder()
                .result("Form has been deleted successfully.")
                .build();
    }
}
