package com.swp391.dto.request;

import com.swp391.Enum.EventStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreateRequest {
    String title;
    String date;
    LocalTime startTime;
    LocalTime endTime;
    String location;
    String description;
    MultipartFile image;
    String session; // Thêm session (ALL, MORNING, AFTERNOON)
    LocalTime donationMorningStart; // Thêm thời gian hiến máu buổi sáng
    LocalTime donationMorningEnd;
    LocalTime donationAfternoonStart; // Thêm thời gian hiến máu buổi chiều
    LocalTime donationAfternoonEnd;
    List<Integer> bloodTypeIds;// Thêm loại máu
    Integer maxRegistrations; // Thêm số lượng đăng ký
    int staffId; // ID của nhân viên tạo sự kiện
}