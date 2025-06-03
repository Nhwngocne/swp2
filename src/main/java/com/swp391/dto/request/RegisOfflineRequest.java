package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisOfflineRequest {
    String name;
    String phone;
    String numberCccd;
    String address;
}