package com.swp391.entity;

import com.swp391.Enum.EventStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(nullable = false, length = 255)
    String title;

    @Column(nullable = false)
    LocalDate date;

    @Column(nullable = false)
    LocalTime startTime;

    @Column(nullable = false)
    LocalTime endTime;

    @Column(nullable = false)
    String location;

    @Column(length = 5000)
    String description;

    @Column(length = 255)
    String imageUrl;

    @Column(nullable = false)
    //@Enumerated(EnumType.STRING)
    String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    @JsonManagedReference // Serialize Staff
    Staff createdBy;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Serialize Img
    Set<Img> images = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "event_registrations",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    @JsonIgnore // Không serialize Member để tránh vòng lặp
    Set<Member> registeredMembers = new HashSet<>();

    @Column(length = 20)
    private String session; // ALL, MORNING, AFTERNOON

    @Column
    private LocalTime donationMorningStart;

    @Column
    private LocalTime donationMorningEnd;

    @Column
    private LocalTime donationAfternoonStart;

    @Column
    private LocalTime donationAfternoonEnd;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "event_blood_types",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "blood_type_id")
    )
    @JsonIgnore
    private Set<BloodType> bloodTypes = new HashSet<>();

    @Column
    private Integer maxRegistrations;
}