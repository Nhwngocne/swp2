package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    LocalDate issuedDate;

    @Column(length = 50)
    String issuedBy; // Tên nhân viên/staff cấp

    @Column(length = 255)
    String imageUrl; // URL dẫn tới file ảnh chứng chỉ

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_history_id", referencedColumnName = "id")
    DonationHistory donationHistory;
}
