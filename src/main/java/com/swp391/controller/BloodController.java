package com.swp391.controller;

import com.swp391.dto.request.BloodInventoryCreateRequest;
import com.swp391.dto.request.BloodInventoryUpdateRequest;
import com.swp391.dto.request.BloodTypeCreateRequest;
import com.swp391.dto.request.BloodTypeUpdateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BloodInventoryResponse;
import com.swp391.dto.response.BloodTypeResponse;
import com.swp391.service.BloodService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blood")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodController {

    BloodService bloodService;

    // ==== INIT ====
    @PostConstruct
    public void initCheckLowBloodInventory() {
        System.out.println("🚀 Hệ thống khởi động -> Kiểm tra kho máu ban đầu...");
        bloodService.checkAndNotifyLowBlood();
    }

    // ==== BLOOD TYPE ====

    @PostMapping("/type")
    public ApiResponse<BloodTypeResponse> createBloodType(@RequestBody @Valid BloodTypeCreateRequest request) {
        return ApiResponse.<BloodTypeResponse>builder()
                .result(bloodService.createBloodType(request))
                .build();
    }

    @PutMapping("/type/{typeId}")
    public ApiResponse<BloodTypeResponse> updateBloodType(
            @PathVariable int typeId,
            @RequestBody @Valid BloodTypeUpdateRequest request) {
        return ApiResponse.<BloodTypeResponse>builder()
                .result(bloodService.updateBloodType(typeId, request))
                .build();
    }

    @DeleteMapping("/type/{typeId}")
    public ApiResponse<String> deleteBloodType(@PathVariable int typeId) {
        bloodService.deleteBloodType(typeId);
        return ApiResponse.<String>builder()
                .result("Blood type has been deleted")
                .build();
    }

    @GetMapping("/type")
    public ApiResponse<List<BloodTypeResponse>> getAllBloodTypes() {
        return ApiResponse.<List<BloodTypeResponse>>builder()
                .result(bloodService.getAllBloodTypes())
                .build();
    }

    @GetMapping("/type/{typeId}")
    public ApiResponse<BloodTypeResponse> getBloodTypeById(@PathVariable int typeId) {
        return ApiResponse.<BloodTypeResponse>builder()
                .result(bloodService.getBloodTypeById(typeId))
                .build();
    }

    // ==== BLOOD INVENTORY ====

    @PostMapping("/inventory")
    public ApiResponse<BloodInventoryResponse> createBloodInventory(
            @RequestBody @Valid BloodInventoryCreateRequest request) {
        return ApiResponse.<BloodInventoryResponse>builder()
                .result(bloodService.createBloodInventory(request))
                .build();
    }

    @PutMapping("/inventory/{inventoryId}")
    public ApiResponse<BloodInventoryResponse> updateBloodInventory(
            @PathVariable int inventoryId,
            @RequestBody @Valid BloodInventoryUpdateRequest request) {
        return ApiResponse.<BloodInventoryResponse>builder()
                .result(bloodService.updateBloodInventory(inventoryId, request))
                .build();
    }

    @DeleteMapping("/inventory/{inventoryId}")
    public ApiResponse<String> deleteBloodInventory(@PathVariable int inventoryId) {
        bloodService.deleteBloodInventory(inventoryId);
        return ApiResponse.<String>builder()
                .result("Blood inventory has been deleted")
                .build();
    }

    @GetMapping("/inventory")
    public ApiResponse<List<BloodInventoryResponse>> getAllBloodInventories() {
        return ApiResponse.<List<BloodInventoryResponse>>builder()
                .result(bloodService.getAllBloodInventories())
                .build();
    }

    @GetMapping("/inventory/{inventoryId}")
    public ApiResponse<BloodInventoryResponse> getBloodInventoryById(@PathVariable int inventoryId) {
        return ApiResponse.<BloodInventoryResponse>builder()
                .result(bloodService.getBloodInventoryById(inventoryId))
                .build();
    }

    // ==== CHECK LOW BLOOD ====

    @PostMapping("/inventory/check-low")
    public ApiResponse<String> checkLowBloodInventory() {
        bloodService.checkAndNotifyLowBlood();
        return ApiResponse.<String>builder()
                .result("Đã kiểm tra kho máu và gửi thông báo cho staff nếu cần.")
                .build();
    }
}
