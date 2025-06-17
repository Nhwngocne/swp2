package com.swp391.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.Enum.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUpdateRequest {

    int id;
    String name;
    String email;
    String password;
    Gender gender;
    String phone;
    String numberCccd;
    String address;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;
}
