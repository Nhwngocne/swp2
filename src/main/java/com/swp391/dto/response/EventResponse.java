package com.swp391.dto.response;

import com.swp391.Enum.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


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
    private List<String> bloodTypes; // Thêm loại máu
    private Integer maxRegistrations; // Thêm số lượng đăng ký
}