package com.swp391.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QnAResponse {
    private int id;
    private String question;
    private String answer;
    private MemberResponse member;
    private StaffResponse staff;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}
