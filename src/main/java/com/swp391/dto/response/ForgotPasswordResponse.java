package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForgotPasswordResponse {
    String email;
    String status;  // e.g. "OTP sent", "OTP verified"
    Long expirationTime; // optional
}
