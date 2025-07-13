package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "blood_donation_forms")
@Getter
@Setter
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
    // Thêm quan hệ với BloodType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    BloodType bloodType;

    // Câu 1: Đã từng hiến máu chưa
    Boolean donatedBefore;


    // Câu 3: Từng mắc bệnh nguy hiểm
    Boolean hadSeriousDisease;


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
    Boolean symptomsPast2Weeks;

    // Câu 8: Trong 1 tuần qua
    Boolean symptomsPast1Week;
    // Voluome of blood donation, if applicable
    @Column(name = "volume_ml")
    Integer volumeMl;
    // Câu 9: Chỉ dành cho nữ
    Boolean isMenstruating;
    Boolean isPregnantOrRecentlyDelivered;
    Boolean noneOfFemaleConditions;

    // Các trường mới cho check-in
    @Column(nullable = true)
    Double weight; // Cân nặng (kg)

    @Column(nullable = true)
    Double height; // Chiều cao (cm)

    @Column(nullable = true)
    String bloodPressure; // Huyết áp (e.g., "120/80")

    @Column(nullable = true)
    String note; // Ghi chú của staff

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
