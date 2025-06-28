package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_component_compatibility")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodComponentCompatibility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private BloodComponent component;

    @ManyToOne
    @JoinColumn(name = "donor_type_id")
    private BloodType donor;

    @ManyToOne
    @JoinColumn(name = "recipient_type_id")
    private BloodType recipient;
}
