package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistoryCreateRequest {

    LocalDate date;

    Integer volume; // ml

    String component; // Hồng cầu, tiểu cầu...

    String status; // VD: Hoàn thành, Đang chờ,...

    String location; // Địa điểm hiến máu

    String testResult; // VD: Đạt tiêu chuẩn

    LocalDate nextEligibleDate;

    // ID của các thực thể liên quan
    int staffId;
    int memberId;
    int bloodTypeId;
}
