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
public class BloodInventoryUpdateRequest {
    String component;
    Integer quantity;
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate lastUpdated;

    Long adminId; // optional
    Long staffId; // optional
}
