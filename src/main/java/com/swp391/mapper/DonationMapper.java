package com.swp391.mapper;

import com.swp391.dto.request.DonationHistoryCreateRequest;
import com.swp391.dto.request.DonationRegistrationRequest;
import com.swp391.dto.request.RegisReceiveRequest;
import com.swp391.dto.response.DonationHistoryResponse;
import com.swp391.dto.response.RegisOfflineResponse;
import com.swp391.dto.response.RegisReceiveResponse;
import com.swp391.entity.DonationHistory;
import com.swp391.entity.DonationRegistration;
import com.swp391.entity.RegisReceive;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DonationMapper {
    // DonationHistory
    DonationHistory toDonationHistory(DonationHistoryCreateRequest donationHistory);

    DonationHistoryResponse toDonationHistoryResponse(DonationHistory entity);

    void updateDonationHistory(@MappingTarget DonationHistory entity, DonationHistoryCreateRequest request);

    // DonationRegistration
    DonationRegistration toDonationRegistration(DonationRegistrationRequest request);

    void updateDonationRegistration(@MappingTarget DonationRegistration entity, DonationRegistrationRequest request);

    // RegisOffline
    @org.mapstruct.Mapping(target = "bloodType", ignore = true)
    RegisReceive toRegisReceive(RegisReceiveRequest request);

    RegisOfflineResponse toRegisOfflineResponse(RegisReceive entity);

    @org.mapstruct.Mapping(target = "bloodType", ignore = true)
    void updateRegisReceive(@MappingTarget RegisReceive entity, RegisReceiveRequest request);

    // RegisReceive
    @org.mapstruct.Mapping(target = "bloodType", ignore = true)
    RegisReceive toRegisReceive(DonationRegistrationRequest request);

    RegisReceiveResponse toRegisReceiveResponse(RegisReceive entity);

    @org.mapstruct.Mapping(target = "bloodType", ignore = true)
    void updateRegisReceive(@MappingTarget RegisReceive entity, DonationRegistrationRequest request);
}

