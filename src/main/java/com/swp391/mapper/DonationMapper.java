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
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DonationMapper {

    // DonationHistory
    @Mapping(target = "staff", ignore = true)           // Gán staff từ service
    @Mapping(target = "member", ignore = true)          // Gán member từ service
    @Mapping(target = "bloodType", ignore = true)       // Gán bloodType từ service
    @Mapping(target = "certificate", ignore = true)     // Không tạo certificate ở đây
    DonationHistory toDonationHistory(DonationHistoryCreateRequest donationHistory);

    @Mapping(source = "bloodType.name", target = "bloodGroup")
    @Mapping(ignore = true, target = "certificateNumber")
    DonationHistoryResponse toDonationHistoryResponse(DonationHistory entity);

    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "bloodType", ignore = true)
    @Mapping(target = "certificate", ignore = true)
    void updateDonationHistory(@MappingTarget DonationHistory entity, DonationHistoryCreateRequest request);

    // DonationRegistration
    DonationRegistration toDonationRegistration(DonationRegistrationRequest request);

    void updateDonationRegistration(@MappingTarget DonationRegistration entity, DonationRegistrationRequest request);

    // RegisOffline
    @Mapping(target = "bloodType", ignore = true)
    RegisReceive toRegisReceive(RegisReceiveRequest request);

    RegisOfflineResponse toRegisOfflineResponse(RegisReceive entity);

    @Mapping(target = "bloodType", ignore = true)
    void updateRegisReceive(@MappingTarget RegisReceive entity, RegisReceiveRequest request);

    // RegisReceive (from DonationRegistration)
    @Mapping(target = "bloodType", ignore = true)
    RegisReceive toRegisReceive(DonationRegistrationRequest request);

    RegisReceiveResponse toRegisReceiveResponse(RegisReceive entity);

    @Mapping(target = "bloodType", ignore = true)
    void updateRegisReceive(@MappingTarget RegisReceive entity, DonationRegistrationRequest request);
}
