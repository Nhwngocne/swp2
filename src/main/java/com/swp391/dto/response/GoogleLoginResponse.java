package com.swp391.dto.response;

import com.swp391.entity.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoogleLoginResponse {
    String token;
    boolean authenticated;
    Object user;
    String role;
}