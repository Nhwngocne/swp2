package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "member")
public class Member {
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

    @Column(length = 100)
    String job;

    @Column(length = 255)
    String address;

    @Column(length = 20)
    String phone;


    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate dob;

    @Column(length = 20)
    String numberCccd;


    @OneToOne(mappedBy = "member")
    ForgotPassword forgotPassword;

    @ManyToOne
    Admin admin;

    @OneToOne
    BloodType bloodType;

    @OneToOne
    DonationHistory donationHistory;

    @OneToMany(mappedBy = "member")
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "member")
    List<Blog> blogs;

    @OneToMany(mappedBy = "member")
    List<Reminder> reminders;

    @OneToMany(mappedBy = "member")
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "member")
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "member")
    List<EmergencyRequest> emergencyRequests;

    @OneToOne(mappedBy = "member")
    NearbyDonor nearbyDonor;

    @ManyToMany(mappedBy = "members")
    Set<Staff> staff;
}
