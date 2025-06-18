package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
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
    int id;

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

    @Column(name = "dob")
    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;

    @Column(length = 20)
    String numberCccd;

    @Column(length = 255)
    String address;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<Reminder> reminders;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<BloodType> bloodTypes;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<DonationHistory> donationHistories;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<Member> members;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<Staff> staffList;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore // Không serialize
    List<Blog> blogs;

    @OneToOne(mappedBy = "admin")
    @JsonIgnore // Không serialize
    BloodInventory bloodInventory;
}