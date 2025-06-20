package com.swp391.dto.response;

import com.swp391.entity.Admin;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogResponse {
    int id;
    String title;
    String summary;
    String content;
    String author;
    String category;
    String image; // ảnh đại diện
    List<String> imageUrls; // ảnh phụ
    int views;
    LocalDate publishedDate;
    Admin createdBy; // tên người tạo (admin name)
}
