package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
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

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;

    @Column(name = "work_time_per_day")
    Double workTimePerDay;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "admin_id", nullable = false) // Quan trọng
    Admin admin;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<BloodType> bloodTypes;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<DonationHistory> donationHistories;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<RegisOffline> regisOfflines;

    @OneToMany(mappedBy = "staff")
    @JsonIgnore // Không serialize
    List<BloodInventory> bloodInventories;

    @ManyToMany
    @JsonIgnore // Không serialize Member để tránh vòng lặp
    Set<Member> members;

    @OneToMany(mappedBy = "createdBy")
    @JsonBackReference // Không serialize Event để tránh vòng lặp
    Set<Event> createdEvents = new HashSet<>();
}