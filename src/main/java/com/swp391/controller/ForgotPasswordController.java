package com.swp391.controller;

import com.swp391.dto.request.ChangePassword;
import com.swp391.dto.response.ApiResponse;
import com.swp391.service.ForgotPasswordService;
import com.swp391.service.MemberService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/forgotPassword")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ForgotPasswordController {
    ForgotPasswordService forgotPasswordService;
    MemberService memberService;

    // STEP 1: Gửi mã OTP qua email
    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyMail(@PathVariable String email) {
        String message = forgotPasswordService.verifyEmail(email);

        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .code(1000)
                        .message(message)
                        .result(Map.of("email", email))
                        .build()
        );
    }

    // STEP 2: Xác minh mã OTP
    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
        String message = forgotPasswordService.verifyOtp(otp, email);

        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .code(1000)
                        .message(message)
                        .result(Map.of("verified", true))
                        .build()
        );
    }

    // STEP 3: Đổi mật khẩu
    @PostMapping("/changePassword/{email}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> changePasswordHandler(
            @RequestBody ChangePassword changePassword,
            @PathVariable String email) {

        memberService.changePassword(email, changePassword);

        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .code(1000)
                        .message("Password changed successfully")
                        .result(Map.of("changed", true))
                        .build()
        );
    }
}
