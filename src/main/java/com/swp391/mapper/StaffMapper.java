package com.swp391.mapper;

import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.StaffResponse;
import com.swp391.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    Staff toStaff(StaffCreateRequest request);

    StaffResponse toStaffResponse(Staff staff);

    void updateStaff(@MappingTarget Staff staff, StaffCreateRequest request);
}
