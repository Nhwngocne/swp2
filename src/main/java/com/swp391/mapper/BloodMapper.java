package com.swp391.mapper;

import com.swp391.dto.request.BloodInventoryCreateRequest;
import com.swp391.dto.request.BloodInventoryUpdateRequest;
import com.swp391.dto.request.BloodTypeCreateRequest;
import com.swp391.dto.request.BloodTypeUpdateRequest;
import com.swp391.dto.response.BloodInventoryResponse;
import com.swp391.dto.response.BloodTypeResponse;
import com.swp391.entity.BloodInventory;
import com.swp391.entity.BloodType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BloodMapper {

    // BLOOD TYPE
    BloodType toBloodType(BloodTypeCreateRequest request);

    @Mapping(source = "admin.name", target = "adminName")
    @Mapping(source = "staff.name", target = "staffName")
    BloodTypeResponse toBloodTypeResponse(BloodType entity);

    void updateBloodType(@MappingTarget BloodType entity, BloodTypeUpdateRequest request);

    // BLOOD INVENTORY
    BloodInventory toBloodInventory(BloodInventoryCreateRequest request);

    BloodInventoryResponse toBloodInventoryResponse(BloodInventory entity);

    void updateBloodInventory(@MappingTarget BloodInventory entity, BloodInventoryUpdateRequest request);
}
