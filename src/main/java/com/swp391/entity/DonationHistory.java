package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
@Entity
@Table(name = "donation_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate createdDate; // Ngày tạo lịch sử

    @Column(length = 50)
    String result; // "Đạt" hoặc "Không đạt"

    @Column(length = 255)
    String location; // Cơ sở tiếp nhận máu

    Integer volume; // ml

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate nextEligibleDate; // Ngày có thể hiến tiếp

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    @JsonIgnore
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    @JsonIgnore
    BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @JsonIgnore
    Member member;

    @OneToOne(mappedBy = "donationHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Certificate certificate;

    @OneToOne
    @JoinColumn(name = "blood_donation_form_id", referencedColumnName = "id")
    @JsonIgnore
    BloodDonationForm bloodDonationForm;

    @ManyToOne
    @JoinColumn(name = "event_id")
    Event event;

}
