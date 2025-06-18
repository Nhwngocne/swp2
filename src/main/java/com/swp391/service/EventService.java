package com.swp391.service;

    import com.swp391.Enum.EventStatus;
    import com.swp391.dto.request.EventCreateRequest;
    import com.swp391.dto.response.EventResponse;
    import com.swp391.entity.Event;
    import com.swp391.entity.Staff;
    import com.swp391.exception.AppException;
    import com.swp391.exception.ErrorCode;
    import com.swp391.mapper.EventMapper;
    import com.swp391.repository.EventRepository;
    import com.swp391.repository.StaffRepository;
    import lombok.AccessLevel;
    import lombok.RequiredArgsConstructor;
    import lombok.experimental.FieldDefaults;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    StaffRepository staffRepository; // Add this

    public EventResponse createEvent(EventCreateRequest request) throws IOException {
        var event = eventMapper.toEvent(request);

        // Get staff ID from JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtToken)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String staffId = jwtToken.getToken().getClaimAsString("id");
        if (staffId == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Find staff and set to event
        Staff staff = staffRepository.findById(Integer.parseInt(staffId))
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        event.setCreatedBy(staff);
        event.setStatus(EventStatus.UPCOMING); // Set initial status

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

        // Verify staff ownership
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtToken)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String staffId = jwtToken.getToken().getClaimAsString("id");
        if (!String.valueOf(event.getCreatedBy().getId()).equals(staffId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Rest of the update logic remains the same
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl);
        }

        eventMapper.updateEvent(event, request);
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