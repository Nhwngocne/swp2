package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    LocalDate date;

    Integer volume;

    @Column(length = 50)
    String component;

    @Column(length = 20)
    String status;

    @ManyToOne
    Staff staff;

    @ManyToOne
    Admin admin;

    @ManyToOne
    BloodType bloodType;

    @OneToOne
    Member member;
}
