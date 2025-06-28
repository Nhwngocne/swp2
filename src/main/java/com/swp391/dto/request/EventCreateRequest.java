package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreateRequest {
    String title;
    String description;
    String date; // yyyy-MM-dd
    String startTime; // HH:mm AM/PM
    String endTime;   // HH:mm AM/PM
    String location;
    MultipartFile image;

    String session; // ALL, MORNING, AFTERNOON

    String donationMorningStart; // HH:mm AM/PM
    String donationMorningEnd;
    String donationAfternoonStart;
    String donationAfternoonEnd;

    List<Integer> bloodTypeIds;
    Integer maxRegistrations;

    int staffId;
}
