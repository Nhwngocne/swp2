package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "blood_inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 50)
    String component;

    Integer quantity;

    LocalDate lastUpdated;

    @OneToMany(mappedBy = "bloodInventory")
    List<BloodType> bloodTypes;

    @ManyToOne
    Staff staff;

    @OneToOne
    Admin admin;
}