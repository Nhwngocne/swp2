package com.swp391.repository;

import com.swp391.entity.QnA;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface QnARepository extends JpaRepository<QnA, Integer> {
    // Câu hỏi đã được trả lời (answer != null)
    List<QnA> findByAnswerIsNotNull();

    // Câu hỏi chưa được trả lời (answer == null)
    List<QnA> findByAnswerIsNull();
}
