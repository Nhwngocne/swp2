package com.swp391.mapper;

import com.swp391.dto.request.BloodDonationFormCreateRequest;
import com.swp391.dto.request.BloodDonationFormUpdateRequest;
import com.swp391.dto.response.BloodDonationFormResponse;
import com.swp391.dto.response.DonationHistoryResponse;
import com.swp391.entity.BloodDonationForm;
import com.swp391.entity.DonationHistory;
import org.mapstruct.*;
@Mapper(componentModel = "spring")
public interface BloodDonationFormMapper {

    BloodDonationForm toForm(BloodDonationFormCreateRequest request);

    @Mapping(source = "event.id", target = "eventId")
    @Mapping(source = "event.title", target = "eventTitle")
    @Mapping(source = "event.date", target = "eventDate")
    @Mapping(source = "event.location", target = "eventLocation")
    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "member.email", target = "memberEmail")
    @Mapping(source = "approvedBy.id", target = "approvedByStaffId")
    @Mapping(source = "approvedBy.name", target = "approvedByStaffName")
    //@Mapping(source = "donationHistory", target = "donationHistory")
    BloodDonationFormResponse toFormResponse(BloodDonationForm form);

    // Mapping nested
    //DonationHistoryResponse toDonationHistoryResponse(DonationHistory history);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateForm(@MappingTarget BloodDonationForm form, BloodDonationFormUpdateRequest request);
}
