package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    @Column(length = 20)
    String numberCccd;

    @Column
    String status = "ACTIVE"; // Trạng thái của thành viên (active, inactive, banned)

    @OneToOne(mappedBy = "member")
    @JsonIgnore // Không serialize ForgotPassword
    ForgotPassword forgotPassword;

    @ManyToOne
    @JsonIgnore // Không serialize Admin
    Admin admin;

    @OneToOne
    @JsonIgnore // Không serialize BloodType
    BloodType bloodType;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    @JsonIgnore // Không serialize DonationHistory
    List<DonationHistory> donationHistories; // Thay đổi từ OneToOne thành OneToMany

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<Blog> blogs;

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<Reminder> reminders;

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<DonationRegistration> registrations;

    @OneToMany(mappedBy = "member")
    @JsonIgnore // Không serialize
    List<EmergencyRequest> emergencyRequests;

    @OneToOne(mappedBy = "member")
    @JsonIgnore // Không serialize
    NearbyDonor nearbyDonor;

    @ManyToMany(mappedBy = "members")
    @JsonIgnore // Không serialize Staff để tránh vòng lặp
    Set<Staff> staff;
}