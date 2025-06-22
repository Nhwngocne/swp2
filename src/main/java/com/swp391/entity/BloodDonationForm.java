package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "blood_donation_forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonationForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String bloodType; // A, B, AB, O, UNKNOWN

    // Câu 1: Đã từng hiến máu chưa
    boolean donatedBefore;

    // Câu 2: Có đang mắc bệnh lý
    boolean currentlyIll;

    @Column(length = 255)
    String illnessDetails;

    // Câu 3: Từng mắc bệnh nguy hiểm
    boolean hadSeriousDisease;

    @Column(length = 255)
    String diseaseDetails;

    // Câu 4: Các hoạt động trong 12 tháng qua (checkbox)
    boolean hadMalariaOrOtherInfectious; // Mắc sốt rét, giang mai,...
    boolean receivedBlood;               // Truyền máu hoặc chế phẩm
    boolean gotVaccine;                  // Tiêm vaccine
    boolean noneOfAbove12Months;

    // Câu 5: Các hoạt động trong 6 tháng qua
    boolean tattooOrAcupuncture;
    boolean hadSkinIssues; // Nổi mụn nhọt, viêm da,...

    // Câu 6: Trong 1 tháng qua
    boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7: Trong 2 tuần qua
    @Column(length = 255)
    String symptomsPast2Weeks;

    // Câu 8: Trong 1 tuần qua
    @Column(length = 255)
    String symptomsPast1Week;

    // Câu 9: Chỉ dành cho nữ
    boolean isMenstruating;
    boolean isPregnantOrRecentlyDelivered;
    boolean noneOfFemaleConditions;

    // Ngày tạo form
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate createdAt;

    String status;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    Staff approvedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate approvedDate;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    Member member;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    Event event;
}
