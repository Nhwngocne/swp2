package com.swp391.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentFormResponse {
    int id;
    String intentType;
    String bloodType;
    String location;
    String phone;
    String description;
    int quantity;
    LocalDate availableFrom;
    LocalDate availableTo;
    LocalDate approvedAt;
    String rejectReason;
    String status;

    int memberId;
    String memberName;
    String memberPhone;
}
