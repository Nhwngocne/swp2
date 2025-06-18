package com.swp391.mapper;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.request.EventRequest;
import com.swp391.dto.response.EventResponse;
import com.swp391.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {

    // Converts EventRequest to Event entity
    Event toEvent(EventCreateRequest request);
    // Converts Event entity to EventResponse DTO
    EventResponse toEventResponse(Event event);
    @Mapping(target = "imageUrl", ignore = true)
    void updateEvent(@MappingTarget Event entity, EventCreateRequest request);
}