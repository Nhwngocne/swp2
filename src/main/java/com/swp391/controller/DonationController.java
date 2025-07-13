package com.swp391.controller;

import com.swp391.dto.request.*;
import com.swp391.dto.response.*;
import com.swp391.service.DonationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DonationController {

    DonationService donationService;

    // ===== Donation History =====

    @PostMapping("/histories")
    public ApiResponse<DonationHistoryResponse> createDonationHistory(@RequestBody @Valid DonationHistoryCreateRequest request) {
        return ApiResponse.<DonationHistoryResponse>builder()
                .result(donationService.createDonationHistory(request))
                .build();
    }

    @GetMapping("/histories/{id}")
    public ApiResponse<DonationHistoryResponse> getDonationHistoryById(@PathVariable int id) {
        return ApiResponse.<DonationHistoryResponse>builder()
                .result(donationService.getDonationHistoryById(id))
                .build();
    }

    @GetMapping("/histories")
    public ApiResponse<List<DonationHistoryResponse>> getAllDonationHistories() {
        return ApiResponse.<List<DonationHistoryResponse>>builder()
                .result(donationService.getAllDonationHistories())
                .build();
    }

    @PutMapping("/histories/{id}")
    public ApiResponse<DonationHistoryResponse> updateDonationHistory(@PathVariable int id,
                                                                      @RequestBody @Valid DonationHistoryCreateRequest request) {
        return ApiResponse.<DonationHistoryResponse>builder()
                .result(donationService.updateDonationHistory(id, request))
                .build();
    }

    @DeleteMapping("/histories/{id}")
    public ApiResponse<String> deleteDonationHistory(@PathVariable int id) {
        donationService.deleteDonationHistory(id);
        return ApiResponse.<String>builder()
                .result("Donation history deleted successfully.")
                .build();
    }
    @GetMapping("/histories/member/{memberId}")
    public ApiResponse<List<DonationHistoryResponse>> getDonationHistoriesByMemberId(@PathVariable int memberId) {
        return ApiResponse.<List<DonationHistoryResponse>>builder()
                .result(donationService.getDonationHistoriesByMemberId(memberId))
                .build();
    }

    // ===== Donation Registration =====

    @PostMapping("/registrations")
    public ApiResponse<String> createDonationRegistration(@RequestBody @Valid DonationRegistrationRequest request) {
        donationService.createDonationRegistration(request);
        return ApiResponse.<String>builder()
                .result("Donation registration created successfully.")
                .build();
    }

    @PutMapping("/registrations/{id}")
    public ApiResponse<String> updateDonationRegistration(@PathVariable int id,
                                                          @RequestBody @Valid DonationRegistrationRequest request) {
        donationService.updateDonationRegistration(id, request);
        return ApiResponse.<String>builder()
                .result("Donation registration updated successfully.")
                .build();
    }

    @DeleteMapping("/registrations/{id}")
    public ApiResponse<String> deleteDonationRegistration(@PathVariable int id) {
        donationService.deleteDonationRegistration(id);
        return ApiResponse.<String>builder()
                .result("Donation registration deleted successfully.")
                .build();
    }

    // ===== Regis Offline =====

    @PostMapping("/offline")
    public ApiResponse<RegisOfflineResponse> createRegisOffline(@RequestBody @Valid RegisOfflineRequest request) {
        return ApiResponse.<RegisOfflineResponse>builder()
                .result(donationService.createRegisOffline(request))
                .build();
    }

    @PutMapping("/offline/{id}")
    public ApiResponse<RegisOfflineResponse> updateRegisOffline(@PathVariable int id,
                                                                @RequestBody @Valid RegisOfflineUpdateRequest request) {
        return ApiResponse.<RegisOfflineResponse>builder()
                .result(donationService.updateRegisOffline(id, request))
                .build();
    }

    @GetMapping("/offline/{id}")
    public ApiResponse<RegisOfflineResponse> getRegisOfflineById(@PathVariable int id) {
        return ApiResponse.<RegisOfflineResponse>builder()
                .result(donationService.getRegisOfflineById(id))
                .build();
    }

    @GetMapping("/offline")
    public ApiResponse<List<RegisOfflineResponse>> getAllRegisOffline() {
        return ApiResponse.<List<RegisOfflineResponse>>builder()
                .result(donationService.getAllRegisOffline())
                .build();
    }

    @DeleteMapping("/offline/{id}")
    public ApiResponse<String> deleteRegisOffline(@PathVariable int id) {
        donationService.deleteRegisOffline(id);
        return ApiResponse.<String>builder()
                .result("Đơn đăng ký offline đã được xóa thành công.")
                .build();
    }

    // ===== Regis Receive from Registration =====

    @PostMapping("/receive-from-registration")
    public ApiResponse<RegisReceiveResponse> createRegisReceiveFromRegistration(@RequestBody @Valid DonationRegistrationRequest request) {
        return ApiResponse.<RegisReceiveResponse>builder()
                .result(donationService.createRegisReceiveFromRegistration(request))
                .build();
    }

    @GetMapping("/receive/{id}")
    public ApiResponse<RegisReceiveResponse> getRegisReceiveById(@PathVariable int id) {
        return ApiResponse.<RegisReceiveResponse>builder()
                .result(donationService.getRegisReceiveById(id))
                .build();
    }

    @PutMapping("/receive/{id}")
    public ApiResponse<RegisReceiveResponse> updateRegisReceiveFromRegistration(@PathVariable int id,
                                                                                @RequestBody @Valid DonationRegistrationRequest request) {
        return ApiResponse.<RegisReceiveResponse>builder()
                .result(donationService.updateRegisReceiveFromRegistration(id, request))
                .build();
    }

    @DeleteMapping("/receive/{id}")
    public ApiResponse<String> deleteRegisReceive(@PathVariable int id) {
        donationService.deleteRegisReceive(id);
        return ApiResponse.<String>builder()
                .result("Receive record deleted successfully.")
                .build();
    }
}
