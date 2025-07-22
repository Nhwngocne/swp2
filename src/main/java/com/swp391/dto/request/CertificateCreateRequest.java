package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CertificateCreateRequest {
    int donationHistoryId;

    String donorName;        // Tên người hiến máu
    String donatedDate;      // Ngày hiến máu (có thể dùng kiểu String hoặc LocalDate tùy Controller xử lý)
    String location;         // Cơ sở hiến
    int volume;
}
