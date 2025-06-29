package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonorSearchRequest {
    String address;
    String bloodType;
    String searchType; // "donor" hoặc "receiver"
}