package com.swp391.controller;

import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BloodComponentCompatibilityResponse;
import com.swp391.service.LookupService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lookup")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LookupController {

    LookupService lookupService;

    /**
     * Tra cứu thông tin tương thích máu
     * @param componentId ID của loại thành phần máu (0 nếu không tra cứu theo component)
     * @param bloodTypeId ID của nhóm máu (0 nếu không tra cứu theo bloodType)
     */
    @GetMapping("/{componentId}/{bloodTypeId}")
    public ResponseEntity<ApiResponse<BloodComponentCompatibilityResponse>> lookup(
            @PathVariable int componentId,
            @PathVariable int bloodTypeId) {

        BloodComponentCompatibilityResponse response = lookupService.searchCompatibility(componentId, bloodTypeId);

        return ResponseEntity.ok(
                ApiResponse.<BloodComponentCompatibilityResponse>builder()
                        .code(1000)
                        .message("Lookup result")
                        .result(response)
                        .build()
        );
    }
}
