package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "regis_offline")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisOffline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 100)
    String name;

    @Column(length = 20)
    String phone;

    @Column(length = 20)
    String numberCccd;

    @Column(length = 255)
    String address;

    String email;

    @Column(length = 50)
    String result;

    String bloodType;

    @Column(name = "volume_ml")
    Integer volumeMl;

    @Column(length = 255)
    String location; // Cơ sở tiếp nhận máu

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

    Boolean isMenstruating;

    Boolean isPregnantOrRecentlyDelivered;

    Boolean noneOfFemaleConditions;

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
    Staff staff;
}
