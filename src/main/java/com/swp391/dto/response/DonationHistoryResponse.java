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
    LocalDate createdDate; // Ngày tạo lịch sử
    String result; // "Đạt" hoặc "Không đạt"
    String location; // Cơ sở tiếp nhận máu
    String bloodType; // Tên loại máu (A+, B-, v.v.)
    Integer volume; // ml
    int memberId; // Thay thế MemberResponse bằng memberId
    String memberName; // Thêm memberName
    StaffResponse staff; // ID của nhân viên
    LocalDate nextEligibleDate;

    // Giấy chứng nhận (nếu có)
    String certificateNumber;

    // FORM
    BloodDonationFormResponse bloodDonationForm;
    BloodIntentFormResponse bloodIntentFormResponse;
}
