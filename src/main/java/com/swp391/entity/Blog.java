package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "blogs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 255)
    String title;

    @Column(length = 5000)
    String content;

    LocalDate publishedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Admin admin;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Set<Img> images = new HashSet<>();
}