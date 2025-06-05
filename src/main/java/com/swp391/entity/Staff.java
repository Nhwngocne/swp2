package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "staff")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 100)
    String name;

    @Column(length = 20)
    String numberCccd;

    @Column(length = 100)
    String password;

    @Column(length = 20)
    String phone;

    @Column(length = 10)
    String gender;

    @Column(length = 100)
    String email;

    @Column(length = 100)
    String job;

    @Column(name = "work_time_per_day")
    Double workTimePerDay;

    @ManyToOne
    Admin admin;

    @OneToMany(mappedBy = "staff")
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "staff")
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "staff")
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "staff")
    List<BloodType> bloodTypes;

    @OneToMany(mappedBy = "staff")
    List<DonationHistory> donationHistories;

    @OneToMany(mappedBy = "staff")
    List<RegisOffline> regisOfflines;

    @OneToMany(mappedBy = "staff")
    List<BloodInventory> bloodInventories;

    @ManyToMany
    Set<Member> members;
}
