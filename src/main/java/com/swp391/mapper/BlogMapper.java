package com.swp391.mapper;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.BlogResponse;
import com.swp391.entity.Blog;
import org.mapstruct.Mapper;

@Mapper (componentModel = "spring")
public interface BlogMapper {
    // Converts BlogCreateRequest to Blog entity
    Blog toBlog(BlogCreateRequest request);
    // Converts Blog entity to BlogResponse DTO
    BlogResponse toBlogResponse(Blog entity);

    // Updates an existing Blog entity with data from BlogCreateRequest
    void updateBlog(Blog entity, BlogCreateRequest request);

}
