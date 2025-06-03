package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "regis_receive")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisReceive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne
    Member member;

    @ManyToOne
    Staff staff;

    @ManyToOne
    Admin admin;

    @ManyToOne
    BloodType bloodType;

    @OneToMany(mappedBy = "regisReceive")
    List<NearbyDonor> nearbyDonors;
}
