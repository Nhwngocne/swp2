package com.swp391.controller;


import com.swp391.dto.request.QnAAnswerRequest;
import com.swp391.dto.request.QnAQuestionRequest;
import com.swp391.dto.response.QnAResponse;
import com.swp391.service.QnAService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qna")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QnAController {

    QnAService qnaService;

    // MEMBER gửi câu hỏi
    @PostMapping("/ask")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<QnAResponse> createQuestion(@RequestBody QnAQuestionRequest request) {
        return ResponseEntity.ok(qnaService.createQuestion(request));
    }

    // STAFF trả lời câu hỏi
    @PostMapping("/answer")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<QnAResponse> answerQuestion(@RequestBody QnAAnswerRequest request) {
        return ResponseEntity.ok(qnaService.answerQuestion(request));
    }

    // Tất cả user đều có thể xem danh sách câu hỏi đã được trả lời
    @GetMapping("/answered")
    public ResponseEntity<List<QnAResponse>> getAllAnswered() {
        return ResponseEntity.ok(qnaService.getAllAnswered());
    }

    // STAFF có thể xem danh sách câu hỏi chưa được trả lời
    @GetMapping("/pending")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<QnAResponse>> getPendingQuestions() {
        return ResponseEntity.ok(qnaService.getPendingQuestions());
    }

    // Lấy chi tiết câu hỏi theo ID
    @GetMapping("/{id}")
    public ResponseEntity<QnAResponse> getQnAById(@PathVariable int id) {
        return ResponseEntity.ok(qnaService.getById(id));
    }
    // STAFF có thể thay đổi câu trả lời đã trả lời trước đó
    @PutMapping("/{id}/change-answer")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<String> changeAnswer(
            @PathVariable int id,
            @RequestBody QnAAnswerRequest request) {
        qnaService.changeQnAAnswer(id, request);
        return ResponseEntity.ok("Câu trả lời đã được cập nhật thành công.");
    }

}
