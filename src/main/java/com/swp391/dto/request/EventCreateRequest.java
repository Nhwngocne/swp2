package com.swp391.dto.request;

import com.swp391.Enum.EventStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreateRequest {
    String title;
    String date;
    String startTime;
    String endTime;
    String location;
    String description;
    MultipartFile image;
    String status;
    int staffId; // ID của nhân viên tạo sự kiện
}