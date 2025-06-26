package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormCreateRequest {

    @NotNull(message = "Event ID không được để trống")
    int eventId;

    @NotNull(message = "Member ID không được để trống")
    int memberId;

    @NotNull(message = "Nhóm máu không được để trống")
    String bloodType; // A, B, AB, O, UNKNOWN

    // Câu 1
    boolean donatedBefore;

    // Câu 2
    boolean currentlyIll;
    String illnessDetails;

    // Câu 3
    boolean hadSeriousDisease;
    String diseaseDetails;

    // Câu 4 (checkbox)
    boolean hadMalariaOrOtherInfectious;
    boolean receivedBlood;
    boolean gotVaccine;
    boolean noneOfAbove12Months;

    // Câu 5
    boolean tattooOrAcupuncture;
    boolean hadSkinIssues;

    // Câu 6
    boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7
    String symptomsPast2Weeks;

    // Câu 8
    String symptomsPast1Week;

    // Volume máu
    int bloodVolume; // Đơn vị ml, ví dụ: 350ml, 450ml
    // Câu 9 - nữ
    boolean isMenstruating;
    boolean isPregnantOrRecentlyDelivered;
    boolean noneOfFemaleConditions;
}
