package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;

@Entity
@Table(name = "emergency_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmergencyRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 20)
    String component;

    @Column(length = 255)
    String location;

    @Column(length = 255)
    String name; // Thêm cột name

    @Column(length = 20)
    String phone; // Thêm cột phone

    @Column(length = 5000)
    String description;

    LocalDate createdAt;


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