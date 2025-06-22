package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;

@Entity
@Table(name = "donation_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    LocalDate date;

    Integer volume;

    @Column(length = 50)
    String component;

    @Column(length = 20)
    String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    BloodType bloodType;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Member member;

    @OneToOne(mappedBy = "donationHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Certificate certificate;

}