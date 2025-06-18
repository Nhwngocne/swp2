package com.swp391.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogCreateRequest {
    String title;
    String content;
    LocalDate publishedDate;
    Integer memberId; // ID của Member tạo blog
    Integer adminId;  // nếu có admin liên quan
    List<String> imageUrls; // danh sách đường dẫn ảnh
}