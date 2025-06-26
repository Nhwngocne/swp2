package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmergencyResponse {
    int id;

    String description;

    String location;

    int quantity;

    String contactPhone;

    LocalDate createdAt;

    String status;

    String staffName;
    String memberName;
    String adminName;

    String bloodTypeName; // ví dụ: "A+", "B-"
}
