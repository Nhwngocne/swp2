package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormUpdateRequest {

    @NotNull(message = "ID đơn đăng ký là bắt buộc")
    Integer formId;

    int volumeMl;
    String session;

    // Câu 1
    Boolean donatedBefore;

    // Câu 2
    Boolean currentlyIll;
    String illnessDetails;

    // Câu 3
    Boolean hadSeriousDisease;
    String diseaseDetails;

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
    String symptomsPast2Weeks;
    String symptomsPast1Week;



    // Câu 9 - dành cho nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;

    // Dành cho Staff duyệt
    String status; // "APPROVED", "REJECTED", "PENDING" "COMPLETED"
    Integer approvedByStaffId;
}
