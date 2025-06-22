package com.swp391.mapper;

import com.swp391.dto.request.BloodDonationFormCreateRequest;
import com.swp391.dto.request.BloodDonationFormUpdateRequest;
import com.swp391.dto.response.BloodDonationFormResponse;
import com.swp391.entity.BloodDonationForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BloodDonationFormMapper {

    // Convert CreateRequest -> Entity
    BloodDonationForm toForm(BloodDonationFormCreateRequest request);

    // Convert Entity -> Response
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(source = "event.title", target = "eventTitle")
    @Mapping(source = "event.date", target = "eventDate")
    @Mapping(source = "event.location", target = "eventLocation")

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "member.email", target = "memberEmail")

    @Mapping(source = "approvedBy.id", target = "approvedByStaffId")
    @Mapping(source = "approvedBy.name", target = "approvedByStaffName")
    BloodDonationFormResponse toFormResponse(BloodDonationForm form);

    // Update entity từ update request
    void updateForm(@MappingTarget BloodDonationForm form, BloodDonationFormUpdateRequest request);
}
