package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    Long id;

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

    @Column(length = 20)
    String numberCccd;

//    @OneToMany(mappedBy = "member")
//    List<DonationRegistration> registrations;
//
//    @OneToMany(mappedBy = "member")
//    List<DonationHistory> donations;
//
//    @OneToMany(mappedBy = "member")
//    List<EmergencyRequest> emergencyRequests;
//
//    @OneToMany(mappedBy = "member")
//    List<Reminder> reminders;
//
//    @OneToMany(mappedBy = "member")
//    List<Feedback> feedbacks;
//
//    @OneToMany(mappedBy = "member")
//    List<Blog> blogs;
}
