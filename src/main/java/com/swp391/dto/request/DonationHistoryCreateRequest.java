package com.swp391.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistoryCreateRequest {
    String result; // "Đạt" hoặc "Không đạt"
    int bloodTypeId; // ID của loại máu (liên kết với BloodType)
    String location; // Cơ sở tiếp nhận máu
    Integer volume; // ml
    int bloodDonationFormId; // ID của form hiến máu
    int memberId; // ID của người dùng
    int staffId; // ID của nhân viên
}