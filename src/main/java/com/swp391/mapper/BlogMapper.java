package com.swp391.mapper;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.BlogResponse;
import com.swp391.entity.Blog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
@Mapper(componentModel = "spring")
public interface BlogMapper {

    // Convert BlogCreateRequest to Blog entity
    @Mapping(target = "imageUrls", ignore = true) // xử lý riêng nếu cần
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "views", ignore = true)
    Blog toBlog(BlogCreateRequest request);

    // Convert Blog entity to BlogResponse DTO
    BlogResponse toBlogResponse(Blog entity);

    // Update existing Blog entity from BlogCreateRequest
    @Mapping(target = "imageUrls", ignore = true) // xử lý riêng nếu cần
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "views", ignore = true)
    void updateBlog(@MappingTarget Blog entity, BlogCreateRequest request);
}
