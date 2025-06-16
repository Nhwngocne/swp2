package com.swp391.service;

        import com.swp391.dto.request.EventCreateRequest;
        import com.swp391.dto.response.EventResponse;
        import com.swp391.entity.Event;
        import com.swp391.exception.AppException;
        import com.swp391.exception.ErrorCode;
        import com.swp391.mapper.EventMapper;
        import com.swp391.repository.EventRepository;
        import lombok.AccessLevel;
        import lombok.RequiredArgsConstructor;
        import lombok.experimental.FieldDefaults;
        import org.springframework.stereotype.Service;

        import java.util.List;

        @Service
        @RequiredArgsConstructor
        @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
        public class EventService {

            EventRepository eventRepository;
            EventMapper eventMapper;

            // Create new event
            public EventResponse createEvent(EventCreateRequest request) {
                var event = eventMapper.toEvent(request);
                event = eventRepository.save(event);
                return eventMapper.toEventResponse(event);
            }

            // Update existing event
            public EventResponse updateEvent(int id, EventCreateRequest request) {
                var event = eventRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
                eventMapper.updateEvent(event, request);
                event = eventRepository.save(event);
                return eventMapper.toEventResponse(event);
            }

            // Delete event by id
            public void deleteEvent(int id) {
                eventRepository.deleteById(id);
            }

            // Get all events
            public List<EventResponse> getAllEvents() {
                return eventRepository.findAll()
                        .stream()
                        .map(eventMapper::toEventResponse)
                        .toList();
            }

            // Get event by id
            public EventResponse getEventById(int id) {
                var event = eventRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
                return eventMapper.toEventResponse(event);
            }
        }