package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "blood_types")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 10)
    String name;

    @Column(length = 50)
    String antigens; // Ví dụ: "A, Rh"

    @Column(length = 100)
    String antibodies; // Ví dụ: "Anti-B"

    @Column(name = "can_donate_to")
    String canDonateTo;

    @Column(name = "can_receive_from")
    String canReceiveFrom;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    // Các quan hệ OneToMany khác
    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore
    List<EmergencyRequest> emergencyRequests;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore
    List<DonationRegistration> donationRegistrations;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore
    List<RegisReceive> regisReceives;

    @OneToMany(mappedBy = "bloodType")
    @JsonIgnore
    List<DonationHistory> donationHistories;

    // Admin / Staff chỉ là người tạo nhóm máu, không bắt buộc
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Staff staff;

    // Nếu bạn thực sự cần, Member có thể có nhóm máu
    @OneToOne(mappedBy = "bloodType")
    @JsonIgnore
    Member member;
}
