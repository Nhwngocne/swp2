package com.swp391.dto.request;

import com.swp391.Enum.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUpdateRequest {

    Long id;
    String name;
    String email;
    String password;
    Gender gender;
    String phone;
    String numberCccd;
    String address;
}
