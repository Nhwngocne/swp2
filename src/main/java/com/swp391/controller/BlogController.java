package com.swp391.controller;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.BlogResponse;
import com.swp391.service.BlogService;
import com.swp391.service.ImageService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blogs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogController {

    BlogService blogService;
    ImageService imageService;

    //  Tạo blog mới
    @PostMapping
    public ApiResponse<BlogResponse> createBlog(@ModelAttribute @Valid BlogCreateRequest request) throws IOException {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.createBlog(request))
                .build();
    }

    //  Cập nhật blog theo ID
    @PutMapping("/{blogId}")
    public ApiResponse<BlogResponse> updateBlog(
            @PathVariable int blogId,
            @ModelAttribute @Valid BlogCreateRequest request) throws IOException {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.updateBlog(blogId, request))
                .build();
    }

    //  Xoá blog theo ID
    @DeleteMapping("/{blogId}")
    public ApiResponse<String> deleteBlog(@PathVariable int blogId) {
        blogService.deleteBlog(blogId);
        return ApiResponse.<String>builder()
                .result("Blog has been deleted")
                .build();
    }

    //  Lấy danh sách tất cả blog
    @GetMapping
    public ApiResponse<List<BlogResponse>> getAllBlogs() {
        return ApiResponse.<List<BlogResponse>>builder()
                .result(blogService.getAllBlogs())
                .build();
    }

    //  Lấy chi tiết blog theo ID
    @GetMapping("/{blogId}")
    public ApiResponse<BlogResponse> getBlogById(@PathVariable int blogId) {
        return ApiResponse.<BlogResponse>builder()
                .result(blogService.getBlogById(blogId))
                .build();
    }

    //  Tăng lượt xem blog
    @PatchMapping("/{blogId}/view")
    public ApiResponse<String> incrementView(@PathVariable int blogId) {
        blogService.incrementView(blogId);
        return ApiResponse.<String>builder()
                .result("View count updated")
                .build();
    }

    //  Upload ảnh cho blog (dùng trong trình soạn thảo như CKEditor)
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("upload") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            Map<String, Object> response = new HashMap<>();
            response.put("url", imageUrl); // Trả về đúng format CKEditor yêu cầu
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Upload failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
