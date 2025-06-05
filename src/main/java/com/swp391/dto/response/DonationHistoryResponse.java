package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistoryResponse {
    int id;
    LocalDate date;
    Integer volume;
    String component;
    String status;

    // Optional thông tin liên quan
    String staffName;
    String adminName;
    String bloodTypeName;
    String memberName;
}
