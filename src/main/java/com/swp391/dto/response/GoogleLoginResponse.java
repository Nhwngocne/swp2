package com.swp391.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoogleLoginResponse {
    private String uid;
    private String email;
    private String name;
    private String token;
}