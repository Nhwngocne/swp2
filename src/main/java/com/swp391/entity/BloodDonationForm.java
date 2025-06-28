package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

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

    @Column
    LocalTime startTime;

    @Column
    LocalTime endTime;

    // Câu 1: Đã từng hiến máu chưa
    Boolean donatedBefore;

    // Câu 2: Có đang mắc bệnh lý
    Boolean currentlyIll;

    @Column(length = 255)
    String illnessDetails;

    // Câu 3: Từng mắc bệnh nguy hiểm
    Boolean hadSeriousDisease;

    @Column(length = 255)
    String diseaseDetails;

    // Câu 4: Các hoạt động trong 12 tháng qua (checkbox)
    Boolean hadMalariaOrOtherInfectious; // Mắc sốt rét, giang mai,...
    Boolean receivedBlood;               // Truyền máu hoặc chế phẩm
    Boolean gotVaccine;                  // Tiêm vaccine
    Boolean noneOfAbove12Months;

    // Câu 5: Các hoạt động trong 6 tháng qua
    Boolean tattooOrAcupuncture;
    Boolean hadSkinIssues; // Nổi mụn nhọt, viêm da,...

    // Câu 6: Trong 1 tháng qua
    Boolean usedAntibioticsOrAntiInflammatory;

    // Câu 7: Trong 2 tuần qua
    @Column(length = 255)
    String symptomsPast2Weeks;

    // Câu 8: Trong 1 tuần qua
    @Column(length = 255)
    String symptomsPast1Week;
    // Voluome of blood donation, if applicable
    @Column(name = "volume_ml")
    Integer volumeMl;
    // Câu 9: Chỉ dành cho nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;

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

    @OneToOne(mappedBy = "bloodDonationForm", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    DonationHistory donationHistory;
}
