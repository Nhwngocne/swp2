package com.swp391.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisOfflineUpdateRequest {
    @NotNull(message = "ID đơn đăng ký là bắt buộc")
    Integer id;

    @NotBlank(message = "Nhóm máu không được để trống")
    String bloodType;

    @NotNull(message = "Dung tích máu không được để trống")
    Integer volumeMl;

    @NotBlank(message = "Kết quả không được để trống")
    String result; // e.g., "Đạt", "Không đạt"


    String note; // Ghi chú của staff

    @NotNull(message = "ID của staff không được để trống")
    Integer staffId;

    @NotBlank(message = "Trạng thái không được để trống")
    String status; // e.g., "COMPLETED", "REJECTED"
}