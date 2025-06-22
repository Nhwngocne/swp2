package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CertificateResponse {
    int id;
    LocalDate issuedDate;
    String issuedBy;
    String imageUrl; // đường dẫn ảnh chứng nhận
    int donationHistoryId;
}
