package com.swp391.mapper;

import com.swp391.dto.request.BloodComponentCompatibilityRequest;
import com.swp391.dto.response.BloodComponentCompatibilityResponse;
import com.swp391.entity.BloodComponentCompatibility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BloodComponentCompatibilityMapper {

    // Convert Request -> Entity
    @Mapping(target = "component", ignore = true) // Gán trong service
    @Mapping(target = "donor", ignore = true)     // Gán trong service
    @Mapping(target = "recipient", ignore = true) // Gán trong service
    BloodComponentCompatibility toEntity(BloodComponentCompatibilityRequest request);

    // Convert Entity -> Response
    BloodComponentCompatibilityResponse toResponse(BloodComponentCompatibility entity);

    // Update entity từ request
    @Mapping(target = "component", ignore = true)
    @Mapping(target = "donor", ignore = true)
    @Mapping(target = "recipient", ignore = true)
    void updateEntity(@MappingTarget BloodComponentCompatibility entity, BloodComponentCompatibilityRequest request);
}
