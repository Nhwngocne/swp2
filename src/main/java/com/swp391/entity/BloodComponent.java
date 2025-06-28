package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "blood_components")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 50, unique = true, nullable = false)
    String name; // red cells, plasma, platelets, whole blood

    @Column(columnDefinition = "TEXT")
    String description; // Tác dụng, cách dùng (ví dụ: hỗ trợ đông máu...)

}
