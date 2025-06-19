package com.swp391.service;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.response.EventResponse;
import com.swp391.entity.Event;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.EventMapper;
import com.swp391.repository.EventRepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventService {
    EventRepository eventRepository;
    EventMapper eventMapper;
    ImageService imageService;
    StaffRepository staffRepository;

    @PreAuthorize("hasRole('STAFF')")
    public EventResponse createEvent(EventCreateRequest request) throws IOException {
        var event = eventMapper.toEvent(request);
        var staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        event.setCreatedBy(staff);
        // Upload image to Cloudinary and get URL
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl);
        }

        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }

    public EventResponse updateEvent(int id, EventCreateRequest request) throws IOException {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        // 1. Nếu có ảnh mới => upload và update imageUrl
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl); // cập nhật image mới
        }

        // 2. Cập nhật các field khác (title, time, v.v.) từ request
        eventMapper.updateEvent(event, request);

        // 3. Lưu lại
        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }

    public void deleteEvent(int id) {
        eventRepository.deleteById(id);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toEventResponse)
                .toList();
    }

    public EventResponse getEventById(int id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
        return eventMapper.toEventResponse(event);
    }
}