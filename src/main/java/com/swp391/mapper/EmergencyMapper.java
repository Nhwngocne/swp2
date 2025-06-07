package com.swp391.mapper;

import com.swp391.dto.request.EmergencyRequestCreateRequest;
import com.swp391.dto.response.EmergencyResponse;
import com.swp391.dto.response.NearbyDonorResponse;
import com.swp391.entity.EmergencyRequest;
import com.swp391.entity.NearbyDonor;
import org.mapstruct.Mapper;

@Mapper (componentModel = "spring")
public interface EmergencyMapper {

    // EmergencyMapper
    // Converts EmergencyRequestCreateRequest to EmergencyRequest entity
    EmergencyRequest toEmergencyRequest(EmergencyRequestCreateRequest request);
    // Converts EmergencyRequest entity to EmergencyResponse DTO
    EmergencyResponse toEmergencyResponse(EmergencyRequest entity);

    // NearbyDonor
    // Converts NearbyDonor entity to NearbyDonorResponse DTO
    NearbyDonorResponse toNearbyDonorResponse(NearbyDonor entity);

}
