package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "staff")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 100)
    String name;

    @Column(length = 20)
    String numberCccd;

    @Column(length = 100)
    String password;

    @Column(length = 20)
    String phone;

    @Column(length = 10)
    String gender;

    @Column(length = 100)
    String email;

    @Column(length = 100)
    String job;

    @Column(name = "work_time_per_day")
    Double workTimePerDay;
}
