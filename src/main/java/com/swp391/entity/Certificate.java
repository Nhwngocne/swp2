package com.swp391.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String donorName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    String donatedDate;      // ngày hiến
    String location;         // cơ sở hiến
    int volume;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_history_id", referencedColumnName = "id")
    DonationHistory donationHistory;
}
