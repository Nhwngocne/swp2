package com.swp391.dto.response;

import com.swp391.entity.BloodType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodInventoryResponse {
    int id;
    String component;
    Integer quantity;
    LocalDate lastUpdated;
    Integer bloodTypeId;
    // Optional - chỉ nếu muốn hiển thị tên người phụ trách
    String staffName;
    String adminName;
}
