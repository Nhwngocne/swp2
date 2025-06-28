package com.swp391.mapper;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.request.EventRequest;
import com.swp391.dto.response.EventResponse;
import com.swp391.entity.Event;
import com.swp391.entity.BloodType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface EventMapper {

    @Mapping(target = "status", constant = "UPCOMING")
    @Mapping(source = "staffId", target = "createdBy.id")
    @Mapping(target = "bloodTypes", ignore = true) // Bỏ qua ánh xạ trực tiếp, xử lý trong service
    Event toEvent(EventCreateRequest request);

    @Mapping(source = "createdBy", target = "staff")
    @Mapping(target = "registeredMemberCount", source = "registeredMembers", qualifiedByName = "mapRegisteredMembersSize")
    @Mapping(source = "bloodTypes", target = "bloodTypes", qualifiedByName = "mapBloodTypesToNames")
    EventResponse toEventResponse(Event event);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "registeredMembers", ignore = true)
    @Mapping(target = "bloodTypes", ignore = true) // Xử lý trong service
    void updateEvent(@MappingTarget Event entity, EventCreateRequest request);

    @Named("mapRegisteredMembersSize")
    default Integer mapRegisteredMembersSize(java.util.Collection<?> registeredMembers) {
        return registeredMembers != null ? registeredMembers.size() : 0;
    }
    @Named("mapBloodTypesToNames")
    default List<String> mapBloodTypesToNames(Set<BloodType> bloodTypes) {
        if (bloodTypes == null) return new ArrayList<>();
        return bloodTypes.stream()
                .map(BloodType::getName)
                .collect(Collectors.toList());
    }
}
