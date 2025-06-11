package com.swp391.mapper;

import com.swp391.dto.request.AdminCreateRequest;
import com.swp391.dto.response.AdminResponse;
import com.swp391.entity.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper (componentModel = "spring")
public interface AdminMapper {

     Admin toAdmin(AdminCreateRequest request);

     AdminResponse toAdminResponse(Admin entity);

     void updateAdmin(@MappingTarget Admin entity, AdminCreateRequest request);
}
