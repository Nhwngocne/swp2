package com.swp391.controller;

import com.swp391.dto.request.FeedbackRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.FeedbackResponse;
import com.swp391.service.FeedBackService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackController {
    FeedBackService feedBackService;

    //create
    @PostMapping
    public ApiResponse<FeedbackResponse> createFeedback(@RequestBody @Valid FeedbackRequest request) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedBackService.createFeedback(request))
                .build();
    }

    //update
    @PutMapping("/{feedbackId}")
    public ApiResponse<FeedbackResponse> updateFeedback(
            @PathVariable int feedbackId,
            @RequestBody @Valid FeedbackRequest request) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedBackService.updateFeedback(feedbackId, request))
                .build();
    }

    //delete
    @DeleteMapping("/{feedbackId}")
    public ApiResponse<String> deleteFeedback(@PathVariable int feedbackId) {
        feedBackService.deleteFeedback(feedbackId);
        return ApiResponse.<String>builder()
                .result("Feedback has been deleted")
                .build();
    }

    //getAll
    @GetMapping
    public ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedBackService.getAllFeedbacks())
                .build();
    }

    //getById
    @GetMapping("/{feedbackId}")
    public ApiResponse<FeedbackResponse> getFeedbackById(@PathVariable int feedbackId) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedBackService.getFeedbackById(feedbackId))
                .build();
    }
}
