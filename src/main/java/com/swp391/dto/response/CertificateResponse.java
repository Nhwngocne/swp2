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
    String donorName;        // tên người hiến
    LocalDate donatedDate;   // ngày hiến
    String location;         // cơ sở hiến
    int volume;

    int donationHistoryId;
}
