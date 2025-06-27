package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonorResponse {
    int id;
    String name;
    String address;
    Double latitude;
    Double longitude;
    String bloodType;
    String phone;
    Double distance; // Khoảng cách tính bằng km
}