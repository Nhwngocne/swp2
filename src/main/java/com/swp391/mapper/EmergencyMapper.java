package com.swp391.mapper;

import com.swp391.dto.request.EmergencyRequestCreateRequest;
import com.swp391.dto.request.MemberUpdateRequest;
import com.swp391.dto.response.EmergencyResponse;
import com.swp391.dto.response.NearbyDonorResponse;
import com.swp391.entity.BloodType;
import com.swp391.entity.EmergencyRequest;
import com.swp391.entity.Member;
import com.swp391.entity.NearbyDonor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper (componentModel = "spring")
public interface EmergencyMapper {

    // EmergencyMapper
    // Converts EmergencyRequestCreateRequest to EmergencyRequest entity
    EmergencyRequest toEmergencyRequest(EmergencyRequestCreateRequest request);
    // Converts EmergencyRequest entity to EmergencyResponse DTO
    @Mapping(source = "bloodType", target = "bloodTypeName")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "staff.name", target = "staffName")
    @Mapping(source = "admin.name", target = "adminName")
    EmergencyResponse toEmergencyResponse(EmergencyRequest entity);

    void updateEmergency(@MappingTarget EmergencyRequest emergency, EmergencyRequestCreateRequest request);
    // NearbyDonor
    // Converts NearbyDonor entity to NearbyDonorResponse DTO
    NearbyDonorResponse toNearbyDonorResponse(NearbyDonor entity);

    default String map(BloodType bloodType) {
        return bloodType != null ? bloodType.getName() : null;
    }
}
