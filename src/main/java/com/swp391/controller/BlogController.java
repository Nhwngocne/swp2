package com.swp391.controller;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BlogResponse;
import com.swp391.service.BlogService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/blogs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogController {

    BlogService blogService;

    // Create a new blog
    @PostMapping
    public ApiResponse<BlogResponse> createBlog(@ModelAttribute @Valid BlogCreateRequest request) throws IOException {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.createBlog(request))
                .build();
    }


    // Update an existing blog
    @PutMapping("/{blogId}")
    public ApiResponse<BlogResponse> updateBlog(
            @PathVariable int blogId,
            @RequestBody @Valid BlogCreateRequest request) throws IOException {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.updateBlog(blogId, request))
                .build();
    }

    // Delete a blog
    @DeleteMapping("/{blogId}")
    public ApiResponse<String> deleteBlog(@PathVariable int blogId) {
        blogService.deleteBlog(blogId);
        return ApiResponse.<String>builder()
                .result("Blog has been deleted")
                .build();
    }

    // Get all blogs
    @GetMapping
    public ApiResponse<List<BlogResponse>> getAllBlogs() {
        return ApiResponse.<List<BlogResponse>>builder()
                .result(blogService.getAllBlogs())
                .build();
    }

    // Get a blog by ID
    @GetMapping("/{blogId}")
    public ApiResponse<BlogResponse> getBlogById(@PathVariable int blogId) {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.getBlogById(blogId))
                .build();
    }
}