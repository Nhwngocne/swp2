package com.swp391.mapper;

import com.swp391.dto.request.BloodIntentFormRequest;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.entity.BloodIntentForm;
import com.swp391.entity.Member;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BloodIntentFormMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "availableFrom", ignore = true)
    @Mapping(target = "availableTo", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "member", ignore = true)
        // sẽ set thủ công trong service
    BloodIntentForm toEntity(BloodIntentFormRequest request);

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "member.phone", target = "memberPhone")
    BloodIntentFormResponse toResponse(BloodIntentForm entity);
}
