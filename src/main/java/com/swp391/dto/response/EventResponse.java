package com.swp391.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.Enum.EventStatus;
import lombok.*;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private int id;
    private String title;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String description;
    private String imageUrl;
    private String status;
    private StaffDto staff;
    private int registeredMemberCount;
    private String session; // Thêm session
    private LocalTime donationMorningStart; // Thêm thời gian hiến máu
    private LocalTime donationMorningEnd;
    private LocalTime donationAfternoonStart;
    private LocalTime donationAfternoonEnd;
    private Integer maxRegistrations; // Thêm số lượng đăng ký
    private boolean isRegistered;
    private boolean isCanDonate;
}