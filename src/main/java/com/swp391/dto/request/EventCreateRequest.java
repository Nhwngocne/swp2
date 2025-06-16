package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreateRequest {
    String title;
    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;
    String location;
    String description;
    String imageUrl;
}