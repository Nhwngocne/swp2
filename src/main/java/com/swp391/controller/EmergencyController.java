package com.swp391.controller;

import com.swp391.dto.request.EmergencyRequestCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.EmergencyResponse;
import com.swp391.dto.response.NearbyDonorResponse;
import com.swp391.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emergencies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmergencyController {
    EmergencyService emergencyService;

    //create
    @PostMapping("/emergency")
    public ApiResponse<EmergencyResponse> createEmergencyRequest(
            @RequestBody @Valid EmergencyRequestCreateRequest request) {
        return ApiResponse.<EmergencyResponse>builder()
                .result(emergencyService.createEmergencyRequest(request))
                .build();
    }

    //getById
    @GetMapping("/emergency/{emergencyId}")
    public ApiResponse<EmergencyResponse> getEmergencyRequestById(@PathVariable int emergencyId) {
        return ApiResponse.<EmergencyResponse>builder()
                .result(emergencyService.getEmergencyRequestById(emergencyId))
                .build();
    }

    //getAll
    @GetMapping("/emergency")
    public ApiResponse<List<EmergencyResponse>> getAllEmergencyRequests() {
        return ApiResponse.<List<EmergencyResponse>>builder()
                .result(emergencyService.getAllEmergencyRequests())
                .build();
    }

    //update
    @PutMapping("/emergency/{emergencyId}")
    public ApiResponse<EmergencyResponse> updateEmergencyRequest(
            @PathVariable int emergencyId,
            @RequestBody @Valid EmergencyRequestCreateRequest request) {
        return ApiResponse.<EmergencyResponse>builder()
                .result(emergencyService.updateEmergencyRequest(emergencyId, request))
                .build();
    }

    //delete
    @DeleteMapping("/emergency/{emergencyId}")
    public ApiResponse<String> deleteEmergencyRequest(@PathVariable int emergencyId) {
        emergencyService.deleteEmergencyRequest(emergencyId);
        return ApiResponse.<String>builder()
                .result("Emergency request has been deleted")
                .build();
    }

    //getAll NearbyDonors
    @GetMapping("/nearbyDonors")
    public ApiResponse<List<NearbyDonorResponse>> getAllNearbyDonors() {
        return ApiResponse.<List<NearbyDonorResponse>>builder()
                .result(emergencyService.getAllNearbyDonors())
                .build();
    }

    //getNearbyDonorById
    @GetMapping("/nearbyDonors/{nearbyDonorId}")
    public ApiResponse<NearbyDonorResponse> getNearbyDonorById(@PathVariable int nearbyDonorId) {
        return ApiResponse.<NearbyDonorResponse>builder()
                .result(emergencyService.getNearbyDonorById(nearbyDonorId))
                .build();
    }
}
