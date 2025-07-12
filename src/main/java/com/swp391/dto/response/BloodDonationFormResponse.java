package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormResponse {

    int id;

    // Thông tin sự kiện
    Integer eventId;
    String eventTitle;
    LocalDate eventDate;
    String eventLocation;



    // Thông tin người đăng ký
    Integer memberId;
    String memberName;
    String memberEmail;
    Integer bloodTypeId; // Thêm trường này
    String bloodTypeName; // Thêm trường này để trả về tên nhóm máu

    // Nội dung đơn đăng ký
    Integer volumeMl;
    LocalTime startTime;
    LocalTime endTime;
    LocalDate createdAt;

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

    // Trạng thái phê duyệt
    String status;
    LocalDate approvedDate;

    Integer approvedByStaffId;
    String approvedByStaffName;

    // history
    //DonationHistoryResponse donationHistory;
}
