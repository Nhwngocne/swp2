package com.swp391.dto.request;

import lombok.Data;

@Data
public class OtpRequest {
    private String email;
    private Integer otp;
}