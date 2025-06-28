package com.swp391.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentFormRequest {
    String intentType;
    String bloodType;
    String location;
    String description;
    String phone;
    int quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate availableFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate availableTo;
}
