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
    String component;
    String location;
    LocalDate freeday;
    String status;

    // Thông tin liên quan
    String staffName;
    String memberName;
    String adminName;
    String bloodTypeName;
}
