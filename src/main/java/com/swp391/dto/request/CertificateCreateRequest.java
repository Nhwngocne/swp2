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
    String issuedBy;
    MultipartFile file; // file ảnh chứng chỉ upload từ phía staff
}
