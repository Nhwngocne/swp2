package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    @JsonIgnore // Không serialize
    List<BloodType> bloodTypes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Staff staff;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Admin admin;
}