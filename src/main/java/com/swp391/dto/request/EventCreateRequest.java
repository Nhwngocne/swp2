package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreateRequest {
    String title;
    String description;
    LocalDate date; // yyyy-MM-dd
    @DateTimeFormat(pattern = "HH:mm")
    String startTime; // HH:mm AM/PM
    @DateTimeFormat(pattern = "HH:mm")
    String endTime;   // HH:mm AM/PM
    String location;
    MultipartFile image;

    String session; // ALL, MORNING, AFTERNOON

    String donationMorningStart; // HH:mm AM/PM
    String donationMorningEnd;
    String donationAfternoonStart;
    String donationAfternoonEnd;

    Integer maxRegistrations;

    int staffId;
}
