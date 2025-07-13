package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisOfflineResponse {
    int id;
    String name;
    String phone;
    String numberCccd;
    String address;
    String email;
    String bloodType;
    Integer volumeMl;
    String result;
    String location;
    Boolean donatedBefore;
    Boolean hadSeriousDisease;
    Boolean hadMalariaOrOtherInfectious;
    Boolean receivedBlood;
    Boolean gotVaccine;
    Boolean noneOfAbove12Months;
    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues;
    Boolean usedAntibioticsOrAntiInflammatory;
    Boolean symptomsPast2Weeks;
    Boolean symptomsPast1Week;
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;
    Double weight;
    Double height;
    String bloodPressure;
    String note;
    LocalDate createdAt;
    String status;
    Integer staffId;
    String staffName;
}