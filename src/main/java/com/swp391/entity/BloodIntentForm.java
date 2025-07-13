package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "blood_intent_forms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodIntentForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 10, nullable = false)
    String intentType; // "CHO" hoặc "NHAN"

    @Column(length = 5, nullable = false)
    String bloodType; // "A+", "O-", ...

    @Column(length = 255, nullable = false)
    String location;

    @Column(length = 20, nullable = false)
    String phone;

    @Column(length = 500)
    String description;

    @Column(nullable = false)
    int quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    LocalDate availableFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    LocalDate availableTo;

    @Column
    LocalDate approvedAt;

    @Column(length = 255)
    String rejectReason;

    @Column(length = 20, nullable = false, columnDefinition = "varchar(20) default 'PENDING'")
    String status;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    Member member;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
