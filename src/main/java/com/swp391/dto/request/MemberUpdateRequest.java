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
public class MemberUpdateRequest {
    String email;
    String job;
    String address;
    String phone;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;
}