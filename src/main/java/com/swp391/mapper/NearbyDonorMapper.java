package com.swp391.mapper;

import com.swp391.dto.response.DonorResponse;
import com.swp391.entity.NearbyDonor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NearbyDonorMapper {
    @Mapping(target = "distance", ignore = true)
    @Mapping(target = "routeUrl", ignore = true)
    DonorResponse toDonorResponse(NearbyDonor donor);
}