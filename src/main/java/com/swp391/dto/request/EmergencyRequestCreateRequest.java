package com.swp391.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmergencyRequestCreateRequest {

    @NotBlank(message = "Location is required")
    String location;
    String component;
    @NotBlank(message = "Name is required")
    String name;
    String phone;
    String description;
    String status;
    int memberId;

}