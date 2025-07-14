package com.swp391.controller;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.EventResponse;
import com.swp391.dto.response.EventStatisticsResponse;
import com.swp391.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventController {
    EventService eventService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<EventResponse> createEvent(@ModelAttribute @Valid EventCreateRequest request) throws IOException {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.createEvent(request))
                .build();
    }

    @PutMapping(value = "/{eventId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<EventResponse> updateEvent(
            @PathVariable int eventId,
            @ModelAttribute @Valid EventCreateRequest request) throws IOException {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.updateEvent(eventId, request))
                .build();
    }

    @DeleteMapping("/{eventId}")
    public ApiResponse<String> deleteEvent(@PathVariable int eventId) {
        eventService.deleteEvent(eventId);
        return ApiResponse.<String>builder()
                .result("Event has been deleted")
                .build();
    }

    @GetMapping
    public ApiResponse<List<EventResponse>> getAllEvents(HttpServletRequest request) {
        return ApiResponse.<List<EventResponse>>builder()
                .result(eventService.getAllEvents(request))
                .build();
    }

    @GetMapping("/{eventId}")
    public ApiResponse<EventResponse> getEventById(@PathVariable int eventId) {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.getEventById(eventId))
                .build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<EventStatisticsResponse>> getEventStatistics() {
        List<EventStatisticsResponse> stats = eventService.getEventStatistics();
        return ResponseEntity.ok(stats);
    }
}