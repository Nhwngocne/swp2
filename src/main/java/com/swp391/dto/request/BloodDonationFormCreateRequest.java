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

    Integer bloodTypeId;

    // Câu 1
    Boolean donatedBefore;

    Boolean hadSeriousDisease;

    Boolean hadMalariaOrOtherInfectious;
    Boolean receivedBlood;
    Boolean gotVaccine;
    Boolean noneOfAbove12Months;

    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues;

    Boolean usedAntibioticsOrAntiInflammatory;

    Boolean symptomsPast2Weeks; // Chuyển thành Boolean để phù hợp với checkbox

    Boolean symptomsPast1Week;  // Chuyển thành Boolean để phù hợp với checkbox

    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;
}
