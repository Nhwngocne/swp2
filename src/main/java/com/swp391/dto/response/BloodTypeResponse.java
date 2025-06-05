package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodTypeResponse {
    int id;
    String name;
    String canDonateTo;
    String canReceiveFrom;

    // Optional - hiển thị người quản lý nhóm máu
    String adminName;
    String staffName;

    // Optional - tên kho máu chứa nhóm máu này
    String bloodInventoryComponent;
}
