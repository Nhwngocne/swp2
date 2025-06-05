package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "emergency_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmergencyRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 50)
    String component;

    @Column(length = 255)
    String location;

    LocalDate freeday;

    @Column(length = 20)
    String status;

    @ManyToOne
    Staff staff;

    @ManyToOne
    Member member;

    @ManyToOne
    Admin admin;

    @ManyToOne
    BloodType bloodType;
}
