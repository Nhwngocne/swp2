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
public class StaffUpdateRequest {
    String name;
    String numberCccd;
    String password;
    String phone;
    String gender;
    String email;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;
    String job;
    Double workTimePerDay;
    int adminId;
}
