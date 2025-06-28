package com.swp391.dto.request;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormCreateRequest {

    @NotNull(message = "Event ID không được để trống")
    Integer eventId;

    @NotNull(message = "Member ID không được để trống")
    Integer memberId;

    Integer volumeMl;

    String session;

    // Câu 1
    Boolean donatedBefore;

    // Câu 2
    Boolean currentlyIll;
    String illnessDetails;

    // Câu 3
    Boolean hadSeriousDisease;
    String diseaseDetails;

    // Câu 4 (checkbox)
    Boolean hadMalariaOrOtherInfectious;
    Boolean receivedBlood;
    Boolean gotVaccine;
    Boolean noneOfAbove12Months;

    // Câu 5
    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues;

    // Câu 6
    Boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7
    String symptomsPast2Weeks;

    // Câu 8
    String symptomsPast1Week;

    // Câu 9 - nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;
}
