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

    // Sự kiện
    int eventId;
    String eventTitle;
    LocalDate eventDate;
    String eventLocation;

    // Người đăng ký
    int memberId;
    String memberName;
    String memberEmail;

    // Nội dung đơn
    String bloodType;
    String donatedBefore;
    String currentIllness;
    String illnessDetails;
    String pastDiseases;
    String diseaseDetails;
    String pastYearActivities;
    String femaleQuestions;
    Boolean agreement;

    // Phê duyệt
    String status;
    LocalDate approvedDate;

    int approvedByStaffId;
    String approvedByStaffName;
}
