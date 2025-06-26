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
    @NotBlank(message = "Description is required")
    String description;

    @NotBlank(message = "Location is required")
    String location;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    int quantity;

    @NotBlank(message = "Contact phone is required")
    String contactPhone;

    @NotNull(message = "Created date is required")
    LocalDate createdAt;

    @NotBlank(message = "Status is required")
    String status;

    @NotNull(message = "Staff ID is required")
    Integer staffId;

    @NotNull(message = "Member ID is required")
    Integer memberId;

    @NotNull(message = "Admin ID is required")
    Integer adminId;

    @NotNull(message = "Blood type ID is required")
    Integer bloodTypeId;
}