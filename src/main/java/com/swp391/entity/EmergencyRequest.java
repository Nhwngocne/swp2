package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    BloodType bloodType;
}