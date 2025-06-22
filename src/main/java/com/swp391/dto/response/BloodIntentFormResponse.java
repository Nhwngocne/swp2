package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentFormResponse {
    int id;
    String intentType;     // CHO hoặc NHAN
    String bloodType;          // A, B, AB, O
    String location;
    LocalDate availableFrom;
    LocalDate availableTo;
    String status;

    int memberId;
    String memberName;
    String memberPhone;
}
