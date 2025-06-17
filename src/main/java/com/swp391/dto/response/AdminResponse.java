package com.swp391.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;
}
