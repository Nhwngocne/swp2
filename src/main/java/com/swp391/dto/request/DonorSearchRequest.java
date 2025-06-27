package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonorSearchRequest {
    String address; // Địa chỉ của người yêu cầu
    String bloodType; // Tùy chọn: Lọc theo nhóm máu
}