package com.swp391.dto.request;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;
}