package com.swp391.service;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.BlogResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.Blog;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BlogMapper;
import com.swp391.repository.BlogRepository;
import com.swp391.repository.AdminRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogService {

    BlogRepository blogRepository;
    BlogMapper blogMapper;
    ImageService imageService;
    AdminRepository adminRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse createBlog(BlogCreateRequest request) throws IOException {
        Blog blog = blogMapper.toBlog(request);


        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm Admin tương ứng
        System.out.println("Username from token: " + email);

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Gán người tạo là Admin
        blog.setCreatedBy(admin);

        // Gán ngày đăng nếu chưa có
        if (blog.getPublishedDate() == null) {
            blog.setPublishedDate(LocalDate.now());
        }

        // Upload ảnh nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            blog.setImage(imageUrl);
            blog.setImageUrls(Collections.singletonList(imageUrl));
        }

        blog.setViews(0);

        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse updateBlog(int id, BlogCreateRequest request) throws IOException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        // Upload ảnh mới nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            blog.setImage(imageUrl);
            blog.setImageUrls(Collections.singletonList(imageUrl));
        }

        blogMapper.updateBlog(blog, request);
        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBlog(int id) {
        if (!blogRepository.existsById(id)) {
            throw new AppException(ErrorCode.BLOG_NOT_FOUND);
        }
        blogRepository.deleteById(id);
    }

    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll()
                .stream()
                .map(blogMapper::toBlogResponse)
                .toList();
    }

    public BlogResponse getBlogById(int id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));
        return blogMapper.toBlogResponse(blog);
    }
}
