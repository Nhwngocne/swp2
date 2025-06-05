package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MemberResponse {
    String name;
    String email;
    String gender;
    String job;
    String address;
    String phone;
    String numberCccd;
}
