package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "blood_intent_forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String intentType; // CHO hoặc NHAN

    String bloodType; // A, B, AB, O

    @Column(length = 255)
    String location;

    @Column
    String phone;
    @Column(length = 500)
    String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate availableFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate availableTo;

    @Column
    LocalDate approvedAt;

    @Column
    String rejectReason;
    @Column(length = 20)
    String status = "PENDING"; // ACTIVE, EXPIRED, CANCELED...

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    Member member;

    @PrePersist
    public void setDatesOnCreate() {
        this.availableFrom = LocalDate.now();
        this.availableTo = LocalDate.now().plusMonths(1);
        this.status = "ACTIVE";
    }
}
