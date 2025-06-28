package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
@Entity
@Table(name = "donation_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    //LocalDate date; // Ngày hiến

    Integer volume; // ml

    @Column(length = 50)
    String resultMessage; // "Đạt tiêu chuẩn", "Không đạt", "Đã hiến", v.v.

    @Column(length = 50)
    String status; // "Hoàn thành", "Đang chờ", v.v.

    @Column(length = 255)
    String location; // Địa điểm hiến (VD: Bệnh viện Chợ Rẫy)

    @Column(length = 255)
    String testResult; // Kết quả xét nghiệm ("Đạt tiêu chuẩn", "Không đạt",...)

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate date;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate nextEligibleDate; // Ngày có thể hiến tiếp

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    Member member;

    @OneToOne(mappedBy = "donationHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Certificate certificate;
}
