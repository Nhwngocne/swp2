package com.swp391.mapper;

import com.swp391.dto.request.NotificationRequest;
import com.swp391.dto.response.NotificationResponse;
import com.swp391.entity.Member;
import com.swp391.entity.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "read", constant = "false")
    @Mapping(target = "member", ignore = true) // set thủ công
    Notification toEntity(NotificationRequest request);

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    NotificationResponse toResponse(Notification notification);

    // Nếu sau này cần update
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget Notification entity, NotificationRequest request);
}
