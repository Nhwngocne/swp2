package com.swp391.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MemberCreateRequest {
    String name;
    String email;
    String password;
    String gender;
    String job;
    String address;
    String phone;
    String numberCccd;
}