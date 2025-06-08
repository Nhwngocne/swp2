package com.swp391.controller;

import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.StaffResponse;
import com.swp391.service.StaffService;
import jakarta.validation.Valid;
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

    //create
    @PostMapping
    public ApiResponse<StaffResponse> createStaff(@RequestBody @Valid StaffCreateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.createStaff(request))
                .build();
    }

    //update
    @PutMapping("/{staffId}")
    public ApiResponse<StaffResponse> updateStaff(
            @PathVariable int staffId,
            @RequestBody @Valid StaffCreateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.updateStaff(staffId, request))
                .build();
    }

    //delete
    @DeleteMapping("/{staffId}")
    public ApiResponse<String> deleteStaff(@PathVariable int staffId) {
        staffService.deleteStaff(staffId);
        return ApiResponse.<String>builder()
                .result("Staff has been deleted")
                .build();
    }

    //getAll
    @GetMapping
    public ApiResponse<List<StaffResponse>> getAllStaff() {
        return ApiResponse.<List<StaffResponse>>builder()
                .result(staffService.getAllStaff())
                .build();
    }

    //getById
    @GetMapping("/{staffId}")
    public ApiResponse<StaffResponse> getStaffById(@PathVariable int staffId) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.getStaffById(staffId))
                .build();
    }
}
