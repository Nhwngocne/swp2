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

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Mapper(componentModel = "spring")
public interface EventMapper {

    @Mapping(target = "status", constant = "UPCOMING")
    @Mapping(source = "staffId", target = "createdBy.id")
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationMorningStart", target = "donationMorningStart", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationMorningEnd", target = "donationMorningEnd", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationAfternoonStart", target = "donationAfternoonStart", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationAfternoonEnd", target = "donationAfternoonEnd", qualifiedByName = "stringToLocalTime")
    @Mapping(target = "bloodTypes", ignore = true)
    Event toEvent(EventCreateRequest request);

    @Mapping(source = "createdBy", target = "staff")
    @Mapping(target = "registeredMemberCount", source = "registeredMembers", qualifiedByName = "mapRegisteredMembersSize")
    @Mapping(source = "bloodTypes", target = "bloodTypes", qualifiedByName = "mapBloodTypesToNames")
    EventResponse toEventResponse(Event event);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "registeredMembers", ignore = true)
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationMorningStart", target = "donationMorningStart", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationMorningEnd", target = "donationMorningEnd", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationAfternoonStart", target = "donationAfternoonStart", qualifiedByName = "stringToLocalTime")
    @Mapping(source = "donationAfternoonEnd", target = "donationAfternoonEnd", qualifiedByName = "stringToLocalTime")
    void updateEvent(@MappingTarget Event entity, EventCreateRequest request);

    @Named("stringToLocalTime")
    default LocalTime stringToLocalTime(String time) {
        if (time == null || time.trim().isEmpty()) return null;

        try {
            return LocalTime.parse(time, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (Exception e) {
            return LocalTime.parse(time, DateTimeFormatter.ofPattern("hh:mm a"));
        }
    }


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
