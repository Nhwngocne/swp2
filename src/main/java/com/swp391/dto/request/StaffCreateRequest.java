package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffCreateRequest {
    String name;
    String numberCccd;
    String password;
    String phone;
    String gender; // Bạn có thể dùng Enum nếu cần giới hạn "Nam"/"Nữ"
    String email;
    String job;
    Double workTimePerDay;
    Long adminId;
}
