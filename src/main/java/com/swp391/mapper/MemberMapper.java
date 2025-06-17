package com.swp391.mapper;

import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.request.MemberUpdateRequest;
import com.swp391.dto.response.MemberResponse;
import com.swp391.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    // Converts MemberCreateRequest to Member entity
    Member toMember(MemberCreateRequest request);
    // Converts Member entity to MemberResponse DTO
    MemberResponse toMemberResponse(Member member);
    // Updates an existing Member entity with data from MemberCreateRequest

    void updateMember(@MappingTarget Member member, MemberUpdateRequest request);
}
