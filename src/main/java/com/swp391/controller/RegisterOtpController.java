package com.swp391.controller;

import com.swp391.dto.request.EmailRequest;
import com.swp391.dto.request.OtpRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RegisterOtpController {

    OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@RequestBody EmailRequest emailRequest) {
        String message = otpService.sendOtp(emailRequest.getEmail());
        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .code(1000)
                        .message(message)
                        .result(Map.of("email", emailRequest.getEmail()))
                        .build()
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@RequestBody OtpRequest otpRequest) {
        String message = otpService.verifyOtp(otpRequest.getOtp(), otpRequest.getEmail());
        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .code(1000)
                        .message(message)
                        .result(Map.of("verified", true))
                        .build()
        );
    }
}