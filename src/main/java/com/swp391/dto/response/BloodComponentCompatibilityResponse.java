package com.swp391.dto.response;

import com.swp391.entity.BloodType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodComponentCompatibilityResponse {
    int componentId;
    String componentName;
    String description;

    int bloodTypeId;
    String bloodTypeName;

    List<BloodType> canDonateTo;      // Nhóm máu có thể truyền cho
    List<BloodType> canReceiveFrom;   // Nhóm máu có thể nhận từ
}
