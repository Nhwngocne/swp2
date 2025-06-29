package com.swp391.mapper;

import com.swp391.dto.response.DonorResponse;
import com.swp391.entity.NearbyDonor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NearbyDonorMapper {
    @Mapping(target = "name", source = "member.name")
    @Mapping(target = "address", source = "bloodIntentForm.location")
    @Mapping(target = "phone", source = "bloodIntentForm.phone")
    @Mapping(target = "bloodType", source = "bloodType.name")
    @Mapping(target = "distance", ignore = true)
    DonorResponse toDonorResponse(NearbyDonor donor);
}