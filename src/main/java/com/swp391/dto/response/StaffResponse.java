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
public class StaffResponse {
    int id;
    String name;
    String numberCccd;
    String phone;
    String gender;
    String email;
    String job;
    String status;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;

    Double workTimePerDay;

    AdminShortResponse admin; // ✅ Thêm dòng này
}
