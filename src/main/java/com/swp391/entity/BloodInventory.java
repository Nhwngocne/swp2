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
    String component; // plasma, RBC, platelet,...

    Integer quantity; // số lượng đơn vị máu hiện có

    LocalDate lastUpdated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")  // foreign key
    BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    Staff staff;

    @OneToOne(fetch = FetchType.LAZY)
    Admin admin;
}
