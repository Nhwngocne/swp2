package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Nhóm máu không được để trống")
    String bloodType; // A, B, AB, O, UNKNOWN

    @NotBlank(message = "Trả lời câu 1 là bắt buộc")
    String donatedBefore; // Có / Không

    @NotBlank(message = "Trả lời câu 2 là bắt buộc")
    String currentIllness; // Có / Không

    String illnessDetails;

    @NotBlank(message = "Trả lời câu 3 là bắt buộc")
    String pastDiseases; // Có / Không / Bệnh khác

    String diseaseDetails;

    String pastYearActivities; // lưu dạng JSON string hoặc chuỗi phân tách

    String femaleQuestions; // lưu nếu là nữ

}
