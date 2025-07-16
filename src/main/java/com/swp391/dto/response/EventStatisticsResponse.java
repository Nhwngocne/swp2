package com.swp391.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class EventStatisticsResponse {
    private Long eventId;
    private String eventName;
    private String eventDate; // Hoặc String

    private int checkinCount;
    private int rejectCount;
    private int notCheckinCount;
    private int passCount;
    private int failCount;
}
