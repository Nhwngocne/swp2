package com.swp391.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentFormRequest {
    String intentType;     // CHO hoặc NHAN
    String bloodType;          // A, B, AB, O
    String location;           // Địa điểm người đăng ký có mặt
    String description;
    String phone;
}
