package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    int id;
    String content;
    Integer rating;
    LocalDateTime createdAt;

    // Thông tin người đánh giá
    String memberName;
}
