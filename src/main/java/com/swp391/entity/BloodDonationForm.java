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

    // Nhóm máu của người đăng ký
    String bloodType; // A, B, AB, O, UNKNOWN

    // Câu 1
    String donatedBefore; // "Có", "Không"

    // Câu 2
    String currentIllness;

    @Column(length = 255)
    String illnessDetails;

    // Câu 3
    String pastDiseases;

    @Column(length = 255)
    String diseaseDetails;

    // Câu 4: checkbox
    @Column(columnDefinition = "TEXT")
    String pastYearActivities;

    // Câu 9: dành cho nữ
    @Column(columnDefinition = "TEXT")
    String femaleQuestions;

    @Column(length = 255)
    LocalDate createdAt;

//    @Enumerated(EnumType.STRING)
    String status;


    @ManyToOne
    @JoinColumn(name = "staff_id")
    Staff approvedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate approvedDate;

    // Quan hệ đến Member (người đăng ký)
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    Member member;

    // Quan hệ đến Event (sự kiện đang đăng ký)
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    Event event;
}
