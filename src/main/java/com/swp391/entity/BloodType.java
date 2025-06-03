package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "blood_types")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 10)
    String name;

    @Column(name = "can_donate_to")
    String canDonateTo;

    @Column(name = "can_receive_from")
    String canReceiveFrom;

    @OneToMany(mappedBy = "bloodType")
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "bloodType")
    List<DonationRegistration> donationRegistrations;

    @OneToMany(mappedBy = "bloodType")
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "bloodType")
    List<DonationHistory> donationHistories;

    @ManyToOne
    BloodInventory bloodInventory;

    @ManyToOne
    Admin admin;

    @ManyToOne
    Staff staff;

    @OneToOne(mappedBy = "bloodType")
    Member member;
}
