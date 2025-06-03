package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    Long id;

    LocalDate regisTime;

    LocalDate donateDate;

    @Column(length = 255)
    String location;

    @Column(length = 20)
    String status;

    @Column(length = 50)
    String component;

    @ManyToOne
    Member member;
}