package com.swp391.mapper;

import com.swp391.dto.request.BloodIntentFormRequest;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.entity.BloodIntentForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BloodIntentFormMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "availableFrom", ignore = true)
    @Mapping(target = "availableTo", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approvedAt", ignore = true)
    @Mapping(target = "rejectReason", ignore = true)
    @Mapping(target = "member", ignore = true)
    BloodIntentForm toEntity(BloodIntentFormRequest request);

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "member.phone", target = "memberPhone")
    BloodIntentFormResponse toResponse(BloodIntentForm entity);

    // Thêm hàm updateEntity để update
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "availableFrom", ignore = true)
    @Mapping(target = "availableTo", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approvedAt", ignore = true)
    @Mapping(target = "rejectReason", ignore = true)
    @Mapping(target = "member", ignore = true)
    void updateEntity(BloodIntentFormRequest request, @MappingTarget BloodIntentForm entity);
}
