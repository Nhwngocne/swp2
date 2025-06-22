package com.swp391.dto.request;

import lombok.Data;

@Data
public class QnAAnswerRequest {
    private int qnaId;
    private String answer;
}
