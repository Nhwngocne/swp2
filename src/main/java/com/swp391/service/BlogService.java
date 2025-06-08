package com.swp391.service;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.BlogResponse;
import com.swp391.entity.Blog;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BlogMapper;
import com.swp391.repository.BlogRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogService {

    BlogRepository blogRepository;
    BlogMapper blogMapper;

    // Create new blog
    public BlogResponse createBlog(BlogCreateRequest request) {
        Blog blog = blogMapper.toBlog(request);
        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    // Update existing blog
    public BlogResponse updateBlog(int id, BlogCreateRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        blogMapper.updateBlog(blog, request);
        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    // Delete blog by id
    public void deleteBlog(int id) {
        blogRepository.deleteById(id);
    }

    // Get all blogs
    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll()
                .stream()
                .map(blogMapper::toBlogResponse)
                .toList();
    }

    // Get blog by id
    public BlogResponse getBlogById(int id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        return blogMapper.toBlogResponse(blog);
    }
}
