package com.swp391.service;

import com.swp391.dto.request.FeedbackRequest;
import com.swp391.dto.response.FeedbackResponse;
import com.swp391.entity.Feedback;
import com.swp391.mapper.FeedBackMapper;
import com.swp391.repository.FeedbackRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedBackService {

    FeedbackRepository feedbackRepository;
    FeedBackMapper feedBackMapper;

    // Create
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        Feedback feedback = feedBackMapper.toFeedback(request);
        feedback = feedbackRepository.save(feedback);
        return feedBackMapper.toFeedbackResponse(feedback);
    }

    // Update
    public FeedbackResponse updateFeedback(int id, FeedbackRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedBackMapper.updateFeedback(feedback, request);
        feedback = feedbackRepository.save(feedback);
        return feedBackMapper.toFeedbackResponse(feedback);
    }

    // Delete
    public void deleteFeedback(int id) {
        feedbackRepository.deleteById(id);
    }

    // Read all
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll()
                .stream()
                .map(feedBackMapper::toFeedbackResponse)
                .toList();
    }

    // Get by ID
    public FeedbackResponse getFeedbackById(int id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        return feedBackMapper.toFeedbackResponse(feedback);
    }
}
