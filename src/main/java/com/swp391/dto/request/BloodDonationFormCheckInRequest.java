package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormCheckInRequest {

    @NotNull(message = "ID đơn đăng ký là bắt buộc")
    Integer formId;

    Integer volumeMl;
    String session;
    Integer bloodTypeId;

    // Câu 1
    Boolean donatedBefore;

    // Câu 3
    Boolean hadSeriousDisease;

    // Câu 4
    Boolean hadMalariaOrOtherInfectious;
    Boolean receivedBlood;
    Boolean gotVaccine;
    Boolean noneOfAbove12Months;

    // Câu 5
    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues;

    // Câu 6
    Boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7 & 8
    Boolean symptomsPast2Weeks;
    Boolean symptomsPast1Week;

    // Câu 9 - dành cho nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;

    // Thông tin check-in
    Double weight; // Cân nặng (kg)
    Double height; // Chiều cao (cm)
    String bloodPressure; // Huyết áp (e.g., "120/80")
    String note; // Ghi chú của staff

    // Dành cho staff
    String status; // "APPROVED", "REJECTED", "PENDING", "COMPLETED"
    Integer approvedByStaffId;
}