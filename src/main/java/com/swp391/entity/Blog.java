package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(length = 255, nullable = false)
    String title;

    @Column(length = 1000)
    String summary;

    @Column(length = 5000, nullable = false)
    String content;

    @Column(length = 255)
    String author;

    @Column(length = 100)
    String category;

    @Column
    int views = 0;

    @Column(length = 1000)
    String image; // ảnh đại diện chính cho blog

    @ElementCollection
    @Column
    List<String> imageUrls;


    LocalDate publishedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonManagedReference
    Admin createdBy;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    Member member;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    Set<Img> images = new HashSet<>();
}
