package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

@Entity
@Table(name = "blood_types")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 10)
    String name;

    @Column(name = "can_donate_to")
    String canDonateTo;

    @Column(name = "can_receive_from")
    String canReceiveFrom;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore // Không serialize
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore // Không serialize
    List<DonationRegistration> donationRegistrations;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore // Không serialize
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore // Không serialize
    List<DonationHistory> donationHistories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference // Không serialize
    BloodInventory bloodInventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore // Không serialize
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore // Không serialize
    Staff staff;

    @OneToOne(mappedBy = "bloodType")
    @JsonIgnore // Không serialize
    Member member;
}