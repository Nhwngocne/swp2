package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MemberResponse {
    Long id;
    String name;
    String email;
    String gender;
    String job;
    String address;
    String phone;
    String numberCccd;

    // Thông tin liên kết đơn giản hóa
    String bloodTypeName;
    String adminName;
}
