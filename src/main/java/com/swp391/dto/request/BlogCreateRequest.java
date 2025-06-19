package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogCreateRequest {
    String title;
    String summary;
    String content;
    String author;
    String category;
    LocalDate publishedDate;

    MultipartFile image;              // Ảnh đại diện chính
}
