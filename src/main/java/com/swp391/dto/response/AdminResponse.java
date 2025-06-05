package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminResponse {

    int id;
    String name;
    String email;
    String gender;
    String phone;
    String numberCccd;
    String address;
}
