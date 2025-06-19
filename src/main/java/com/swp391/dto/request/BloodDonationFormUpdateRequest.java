package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationFormUpdateRequest {

    @NotNull(message = "ID đơn đăng ký là bắt buộc")
    int formId;

    String bloodType;

    String donatedBefore;

    String currentIllness;

    String illnessDetails;

    String pastDiseases;

    String diseaseDetails;

    String pastYearActivities;

    String femaleQuestions;

    // Dành cho Staff duyệt
    String status; // "APPROVED", "REJECTED", "PENDING"

    int approvedByStaffId;
}
