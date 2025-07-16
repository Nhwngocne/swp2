package com.swp391.mapper;

import com.swp391.dto.request.*;
import com.swp391.dto.response.DonationHistoryResponse;
import com.swp391.dto.response.RegisOfflineResponse;
import com.swp391.dto.response.RegisReceiveResponse;
import com.swp391.entity.DonationHistory;
import com.swp391.entity.DonationRegistration;
import com.swp391.entity.RegisOffline;
import com.swp391.entity.RegisReceive;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DonationMapper {

    // DonationHistory
    @Mapping(target = "staff", ignore = true)           // Gán staff từ service
    @Mapping(target = "member", ignore = true)          // Gán member từ service
    @Mapping(target = "event", ignore = true)          // Gán event từ service
    @Mapping(target = "bloodType", ignore = true)       // Gán bloodType từ service
    @Mapping(target = "bloodDonationForm", ignore = true) // Gán bloodDonationForm từ service
    @Mapping(target = "certificate", ignore = true)     // Không tạo certificate ở đây
    @Mapping(target = "createdDate", ignore = true)     // Set trong service
    DonationHistory toDonationHistory(DonationHistoryCreateRequest donationHistory);

    @Mapping(target = "bloodType", expression = "java(mapBloodTypeToString(entity.getBloodType()))")
    @Mapping(target = "memberId", source = "member.id") // Map memberId từ Member
    @Mapping(target = "memberName", source = "member.name") // Map memberName từ Member
    DonationHistoryResponse toDonationHistoryResponse(DonationHistory entity);

    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "bloodType", ignore = true)
    @Mapping(target = "bloodDonationForm", ignore = true)
    @Mapping(target = "certificate", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    void updateDonationHistory(@MappingTarget DonationHistory entity, DonationHistoryCreateRequest request);

    default String mapBloodTypeToString(com.swp391.entity.BloodType bloodType) {
        return bloodType != null ? bloodType.getName() : null;
    }


    // DonationRegistration
    DonationRegistration toDonationRegistration(DonationRegistrationRequest request);

    void updateDonationRegistration(@MappingTarget DonationRegistration entity, DonationRegistrationRequest request);

    // RegisOffline
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "status", constant = "PENDING")
    RegisOffline toRegisOffline(RegisOfflineRequest request);

    @Mapping(source = "staff.id", target = "staffId")
    @Mapping(source = "staff.name", target = "staffName")
    RegisOfflineResponse toRegisOfflineResponse(RegisOffline entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateRegisOffline(@MappingTarget RegisOffline entity, RegisOfflineUpdateRequest request);

    // RegisReceive (from DonationRegistration)
    @Mapping(target = "bloodType", ignore = true)
    RegisReceive toRegisReceive(DonationRegistrationRequest request);

    RegisReceiveResponse toRegisReceiveResponse(RegisReceive entity);

    @Mapping(target = "bloodType", ignore = true)
    void updateRegisReceive(@MappingTarget RegisReceive entity, DonationRegistrationRequest request);
}
