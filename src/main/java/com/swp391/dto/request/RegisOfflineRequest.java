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
public class RegisOfflineRequest {
    @NotBlank(message = "Tên không được để trống")
    String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    String phone;

    @NotBlank(message = "Số CCCD không được để trống")
    String numberCccd;

    String address;

    String email;

    // Câu 1: Đã từng hiến máu chưa
    Boolean donatedBefore;

    // Câu 3: Từng mắc bệnh nguy hiểm
    Boolean hadSeriousDisease;

    // Câu 4: Các hoạt động trong 12 tháng qua
    Boolean hadMalariaOrOtherInfectious;
    Boolean receivedBlood;
    Boolean gotVaccine;
    Boolean noneOfAbove12Months;

    // Câu 5: Các hoạt động trong 6 tháng qua
    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues;

    // Câu 6: Trong 1 tháng qua
    Boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7: Trong 2 tuần qua
    Boolean symptomsPast2Weeks;

    // Câu 8: Trong 1 tuần qua
    Boolean symptomsPast1Week;

    // Câu 9: Dành cho nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;

    @NotNull(message = "ID của staff không được để trống")
    Integer staffId;

    @NotBlank(message = "Địa điểm không được để trống")
    String location;

    Double weight; // Cân nặng (kg)
    Double height; // Chiều cao (cm)
    String bloodPressure; // Huyết áp (e.g., "120/80")
}