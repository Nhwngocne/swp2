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
    String intentType; // CHO hoặc NHAN
    String bloodType;  // A+, B-, AB+, O-
    String location;
    String phone;      // Số ĐT người đăng ký khai báo (trong form)
    String description;
    int quantity;
    LocalDate availableFrom;
    LocalDate availableTo;
    LocalDate approvedAt;
    String rejectReason;
    String status;     // PENDING, ACTIVE, EXPIRED, CANCELED...

    int memberId;
    String memberName;    // tên người đăng ký (từ member)
    String memberPhone;   // số ĐT tài khoản member
}
