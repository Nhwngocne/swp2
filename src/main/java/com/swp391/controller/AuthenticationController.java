package com.swp391.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.nimbusds.jose.JOSEException;
import com.swp391.dto.request.AuthenticationRequest;
import com.swp391.dto.request.IntrospectRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.AuthenticationResponse;
import com.swp391.dto.response.GoogleLoginResponse;
import com.swp391.dto.response.IntrospectResponse;
import com.swp391.service.AuthenticationService;
import com.swp391.service.MemberService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.dto.request.RefreshRequest;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {
    AuthenticationService authenticationService;
    MemberService memberService;
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/loginGoogle")
    public ResponseEntity<ApiResponse<GoogleLoginResponse>> loginGoogle(@RequestBody Map<String, String> body) {
        try {
            String idToken = body.get("token");
            GoogleLoginResponse response = memberService.loginWithGoogle(idToken);
            return ResponseEntity.ok(ApiResponse.<GoogleLoginResponse>builder()
                    .result(response)
                    .build());
        } catch (Exception e) {
            log.error("Google login failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<GoogleLoginResponse>builder()
                            .build());
        }
    }
    @GetMapping("/me")
    public ApiResponse<AuthenticationResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader)
            throws JOSEException, ParseException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String token = authHeader.substring(7); // Remove "Bearer "
        var result = authenticationService.getCurrentUserFromToken(token);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
}
