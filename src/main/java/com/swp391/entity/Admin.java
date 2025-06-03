package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "admin")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 100, nullable = false)
    String name;

    @Column(length = 100, nullable = false, unique = true)
    String email;

    @Column(length = 100, nullable = false)
    String password;

    @Column(length = 10)
    String gender;

    @Column(length = 20)
    String phone;

    @Column(length = 20)
    String numberCccd;

    @Column(length = 255)
    String address;

    @OneToMany(mappedBy = "admin")
    List<Reminder> reminders;

    @OneToMany(mappedBy = "admin")
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "admin")
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "admin")
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "admin")
    List<BloodType> bloodTypes;

    @OneToMany(mappedBy = "admin")
    List<DonationHistory> donationHistories;

    @OneToMany(mappedBy = "admin")
    List<Member> members;

    @OneToMany(mappedBy = "admin")
    List<Staff> staffList;

    @OneToMany(mappedBy = "admin")
    List<Blog> blogs;

    @OneToOne(mappedBy = "admin")
    BloodInventory bloodInventory;
}

