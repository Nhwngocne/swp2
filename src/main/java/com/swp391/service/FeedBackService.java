package com.swp391.service;

import com.swp391.dto.request.FeedbackRequest;
import com.swp391.dto.response.FeedbackResponse;
import com.swp391.entity.Feedback;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.FeedBackMapper;
import com.swp391.repository.FeedbackRepository;
import com.swp391.repository.MemberRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedBackService {

    MemberRepository memberRepository;
    FeedbackRepository feedbackRepository;
    FeedBackMapper feedBackMapper;

    // Create
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Feedback feedback = feedBackMapper.toFeedback(request);
        feedback.setMember(member);
        feedback = feedbackRepository.save(feedback);
        return feedBackMapper.toFeedbackResponse(feedback);
    }

    // Update
    public FeedbackResponse updateFeedback(int id, FeedbackRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED));
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
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED));
        return feedBackMapper.toFeedbackResponse(feedback);
    }
}
