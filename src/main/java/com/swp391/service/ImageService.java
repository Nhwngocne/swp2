package com.swp391.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.swp391.dto.request.ImageRequest;
import com.swp391.entity.Blog;
import com.swp391.entity.Event;
import com.swp391.entity.Img;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.repository.BlogRepository;
import com.swp391.repository.EventRepository;
import com.swp391.repository.ImgRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageService {
    BlogRepository blogRepository;
    EventRepository eventRepository;
    ImgRepository imgRepository;
    Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "swp391",
                            "resource_type", "auto"
                    ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public Img addImageToBlog(ImageRequest request) {
        Blog blog = blogRepository.findById(request.getBlogId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        Img img = Img.builder()
                .url(request.getUrl())
                .blog(blog)
                .build();

        return imgRepository.save(img);
    }

    public Img addImageToEvent(ImageRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        Img img = Img.builder()
                .url(request.getUrl())
                .event(event)
                .build();

        return imgRepository.save(img);
    }

    public List<Img> getAllImages() {
        return imgRepository.findAll();
    }

    public Img getImageById(int id) {
        return imgRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }

    public void deleteImage(int id) {
        Img img = imgRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        if (img.getUrl() != null) {
            try {
                // Extract public_id from URL
                String publicId = extractPublicIdFromUrl(img.getUrl());
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException e) {
                throw new AppException(ErrorCode.FILE_DELETE_FAILED);
            }
        }

        imgRepository.deleteById(id);
    }

    private String extractPublicIdFromUrl(String url) {
        // Extract public_id from Cloudinary URL
        // Example URL: https://res.cloudinary.com/xxx/image/upload/v1234567/swp391/filename.jpg
        String[] urlParts = url.split("/");
        String fileName = urlParts[urlParts.length - 1];
        return "swp391/" + fileName.substring(0, fileName.lastIndexOf('.'));
    }
}