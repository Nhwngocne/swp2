package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffUpdateRequest {
    String name;
    String numberCccd;
    String password;
    String phone;
    String gender;
    String email;
    String job;
    Double workTimePerDay;
    Long adminId;
}
