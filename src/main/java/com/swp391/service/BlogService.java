package com.swp391.service;

import com.swp391.dto.request.BlogCreateRequest;
import com.swp391.dto.response.BlogResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.Blog;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BlogMapper;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.BlogRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        System.out.println("Username from token: " + email);

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        blog.setCreatedBy(admin);

        if (blog.getPublishedDate() == null) {
            blog.setPublishedDate(LocalDate.now());
        }

        // Upload ảnh đại diện chính nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            blog.setImage(imageUrl);
        }

        // Tự động trích ảnh trong nội dung HTML
        List<String> extractedImageUrls = extractImageUrlsFromContent(request.getContent());
        blog.setImageUrls(extractedImageUrls);

        blog.setViews(0);

        blog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse updateBlog(int id, BlogCreateRequest request) throws IOException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        // Cập nhật ảnh đại diện mới nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            blog.setImage(imageUrl);
        }

        // Cập nhật nội dung và các trường khác
        blogMapper.updateBlog(blog, request);

        // Trích lại các ảnh trong nội dung mới
        List<String> updatedImageUrls = extractImageUrlsFromContent(request.getContent());
        blog.setImageUrls(updatedImageUrls);

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

    //  Trích các ảnh từ nội dung HTML CKEditor
    private List<String> extractImageUrlsFromContent(String content) {
        List<String> imageUrls = new ArrayList<>();
        if (content == null) return imageUrls;

        Pattern pattern = Pattern.compile("<img[^>]+src=[\"']([^\"']+)[\"']");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            imageUrls.add(matcher.group(1));
        }
        return imageUrls;
    }
}
