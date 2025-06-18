package com.swp391.dto.request;

    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.Pattern;
    import lombok.*;
    import lombok.experimental.FieldDefaults;
    import org.springframework.web.multipart.MultipartFile;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public class EventCreateRequest {
        @NotBlank(message = "Title cannot be empty")
        String title;

        @NotBlank(message = "Date cannot be empty")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in format YYYY-MM-DD")
        String date;

        @NotBlank(message = "Start time cannot be empty")
        String startTime;

        @NotBlank(message = "End time cannot be empty")
        String endTime;

        @NotBlank(message = "Location cannot be empty")
        String location;

        @NotBlank(message = "Description cannot be empty")
        String description;

        MultipartFile image;

        // Clean date string before getter returns it
        public String getDate() {
            return date != null ? date.trim().replace("\"", "") : null;
        }

        // Clean time strings before getter returns them
        public String getStartTime() {
            return startTime != null ? startTime.trim().replaceAll("\\s+", "") : null;
        }

        public String getEndTime() {
            return endTime != null ? endTime.trim().replaceAll("\\s+", "") : null;
        }
    }