package com.swp391.service;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.response.EventResponse;
import com.swp391.entity.BloodType;
import com.swp391.entity.Event;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.EventMapper;
import com.swp391.repository.BloodTypeRepository;
import com.swp391.repository.EventRepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

    import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventService {
    EventRepository eventRepository;
    EventMapper eventMapper;
    ImageService imageService;
    StaffRepository staffRepository;
    BloodTypeRepository bloodTypeRepository;

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
        // Ánh xạ bloodTypeIds sang bloodTypes
        if (request.getBloodTypeIds() != null && !request.getBloodTypeIds().isEmpty()) {
            Set<BloodType> bloodTypes = request.getBloodTypeIds().stream()
                    .map(id -> bloodTypeRepository.findById(id)
                            .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND)))
                    .collect(Collectors.toSet());
            event.setBloodTypes(bloodTypes);
        }
        // Tự động set status là UPCOMING khi tạo
        event.setStatus("UPCOMING");
        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }

    public EventResponse updateEvent(int eventId, EventCreateRequest request) throws IOException {
        var event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        // Rest of the update logic remains the same
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl);
        }

        eventMapper.updateEvent(event, request);
        // Ánh xạ bloodTypeIds sang bloodTypes
        if (request.getBloodTypeIds() != null && !request.getBloodTypeIds().isEmpty()) {
            Set<BloodType> bloodTypes = request.getBloodTypeIds().stream()
                    .map(id -> bloodTypeRepository.findById(id)
                            .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND)))
                    .collect(Collectors.toSet());
            event.setBloodTypes(bloodTypes);
        }
        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }
    public void deleteEvent(int id) {
        eventRepository.deleteById(id);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .peek(event -> {
                    LocalDate currentDate = LocalDate.now();
                    if (event.getDate().isBefore(currentDate)) {
                        event.setStatus("COMPLETED"); // Hoặc lưu lại nếu cần
                        eventRepository.save(event); // Lưu thay đổi (tùy chọn)
                    } else if (event.getDate().isEqual(currentDate)) {
                        // Logic cho ONGOING (có thể dựa trên startTime/endTime)
                    }
                })
                .map(eventMapper::toEventResponse)
                .filter(response -> !response.getStatus().equals("COMPLETED")) // Không hiển thị sự kiện đã hoàn thành
                .toList();
    }

    public EventResponse getEventById(int id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
        return eventMapper.toEventResponse(event);
    }
}