package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogUpdateRequest {
    String title;
    String summary;
    String content;
    String author;
    String category;
    LocalDate publishedDate;

    String image;
   // Danh sách ảnh phụ
}