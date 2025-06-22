package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistoryResponse {
    int id;
    LocalDate date;
    String status;
    String location;
    String bloodGroup;
    Integer volume;
    String testResult;
    LocalDate nextEligibleDate;

    // Giấy chứng nhận (nếu có)
    String certificateNumber;
}
