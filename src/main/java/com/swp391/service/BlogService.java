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
import java.util.ArrayList;
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
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        blog.setCreatedBy(admin);

        if (blog.getPublishedDate() == null) {
            blog.setPublishedDate(LocalDate.now());
        }

        // Gán image và imageUrls nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            blog.setImage(request.getImage());
            blog.setImageUrls(new ArrayList<>(List.of(request.getImage())));
        } else {
            blog.setImageUrls(new ArrayList<>()); // tránh NullPointer khi Hibernate merge
        }

        blog.setViews(0);

        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse updateBlog(int id, BlogCreateRequest request) throws IOException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        // Cập nhật dữ liệu khác từ request (ngoại trừ image & imageUrls)
        blogMapper.updateBlog(blog, request);

        // Cập nhật ảnh nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            blog.setImage(request.getImage());
            blog.setImageUrls(new ArrayList<>(List.of(request.getImage())));
        } else {
            blog.setImageUrls(new ArrayList<>()); // Clear danh sách ảnh nếu không có ảnh mới
        }

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

    public void incrementView(int blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        blog.setViews(blog.getViews() + 1);
        blogRepository.save(blog);
    }
}
