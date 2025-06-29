package com.swp391.controller;

import com.swp391.Enum.LatLong;
import com.swp391.dto.request.DonorSearchRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.DonorResponse;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.service.NearbyDonorService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NearbyDonorController {
    NearbyDonorService donorService;

    @PostMapping("/search")
    public ApiResponse<List<DonorResponse>> searchNearestDonors(@RequestBody @Valid DonorSearchRequest request) {
        return ApiResponse.<List<DonorResponse>>builder()
                .result(donorService.findNearestDonors(request))
                .build();
    }

    @GetMapping("/geocode")
    public ApiResponse<LatLong> getGeocode(@RequestParam String address) {
        LatLong latLong = donorService.getLatLongFromAddress(address);
        if (latLong == null) {
            throw new AppException(ErrorCode.INVALID_ADDRESS);
        }
        return ApiResponse.<LatLong>builder().result(latLong).build();
    }
}