package com.swp391.controller;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.EventResponse;
import com.swp391.service.EventService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventController {

    EventService eventService;

    // Create a new event
    @PostMapping
    public ApiResponse<EventResponse> createEvent(@RequestBody @Valid EventCreateRequest request) {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.createEvent(request))
                .build();
    }

    // Update an existing event
    @PutMapping("/{eventId}")
    public ApiResponse<EventResponse> updateEvent(
            @PathVariable int eventId,
            @RequestBody @Valid EventCreateRequest request) {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.updateEvent(eventId, request))
                .build();
    }

    // Delete an event
    @DeleteMapping("/{eventId}")
    public ApiResponse<String> deleteEvent(@PathVariable int eventId) {
        eventService.deleteEvent(eventId);
        return ApiResponse.<String>builder()
                .result("Event has been deleted")
                .build();
    }

    // Get all events
    @GetMapping
    public ApiResponse<List<EventResponse>> getAllEvents() {
        return ApiResponse.<List<EventResponse>>builder()
                .result(eventService.getAllEvents())
                .build();
    }

    // Get an event by ID
    @GetMapping("/{eventId}")
    public ApiResponse<EventResponse> getEventById(@PathVariable int eventId) {
        return ApiResponse.<EventResponse>builder()
                .result(eventService.getEventById(eventId))
                .build();
    }
}