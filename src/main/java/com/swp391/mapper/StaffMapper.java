package com.swp391.mapper;

import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.AdminShortResponse;
import com.swp391.dto.response.StaffResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    Staff toStaff(StaffCreateRequest request);

    @Mapping(target = "admin", expression = "java(toAdminShortResponse(staff.getAdmin()))")
    StaffResponse toStaffResponse(Staff staff);

    void updateStaff(@MappingTarget Staff staff, StaffCreateRequest request);

    // Ánh xạ thủ công từ Admin entity sang AdminShortResponse
    default AdminShortResponse toAdminShortResponse(Admin admin) {
        if (admin == null) return null;
        return AdminShortResponse.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .build();
    }
}
