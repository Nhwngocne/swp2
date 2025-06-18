package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;

@Entity
@Table(name = "donation_registrations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    LocalDate regisTime;

    LocalDate donateDate;

    @Column(length = 255)
    String location;

    @Column(length = 20)
    String status;

    @Column(length = 50)
    String component;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    BloodType bloodType;
}