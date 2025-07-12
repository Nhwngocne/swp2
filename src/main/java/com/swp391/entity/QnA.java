package com.swp391.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "qna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QnA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private LocalDateTime createdAt;

    private LocalDateTime answeredAt;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member; // người hỏi

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff; // người trả lời
}

