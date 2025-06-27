package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormResponse {

    int id;

    // Thông tin sự kiện
    int eventId;
    String eventTitle;
    LocalDate eventDate;
    String eventLocation;

    // Thông tin người đăng ký
    int memberId;
    String memberName;
    String memberEmail;

    // Nội dung đơn đăng ký
    String bloodType;

    boolean donatedBefore;
    boolean currentlyIll;
    String illnessDetails;

    boolean hadSeriousDisease;
    String diseaseDetails;

    boolean hadMalariaOrOtherInfectious;
    boolean receivedBlood;
    boolean gotVaccine;
    boolean noneOfAbove12Months;

    boolean tattooOrAcupuncture;
    boolean hadSkinIssues;

    boolean usedAntibioticsOrAntiInflammatory;

    String symptomsPast2Weeks;
    String symptomsPast1Week;

    boolean isMenstruating;
    boolean isPregnantOrRecentlyDelivered;
    boolean noneOfFemaleConditions;

    // Volume máu
    int bloodVolume; // Đơn vị ml, ví dụ: 350ml, 450ml

    // Trạng thái phê duyệt
    String status;
    LocalDate approvedDate;

    int approvedByStaffId;
    String approvedByStaffName;
}
