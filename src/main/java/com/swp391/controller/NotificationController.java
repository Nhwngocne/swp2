package com.swp391.controller;

import com.swp391.dto.request.NotificationRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.NotificationResponse;
import com.swp391.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    // STAFF tạo thông báo cho member
    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/notifications/member")
    public ApiResponse<Void> createNotificationForMember(@RequestBody NotificationRequest request) {
        notificationService.createNotificationForMember(request.getMemberId(), request.getMessage());
        return ApiResponse.<Void>builder()
                .message("Tạo thông báo cho member thành công.")
                .build();
    }


    // MEMBER xem tất cả thông báo của chính mình
    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getMyNotifications())
                .build();
    }

    // STAFF xem thông báo theo member (vd để hỗ trợ admin)
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<List<NotificationResponse>> getByMember(@PathVariable int memberId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotificationsByMemberId(memberId))
                .build();
    }

    // STAFF xoá thông báo
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<String> delete(@PathVariable int id) {
        notificationService.deleteNotification(id);
        return ApiResponse.<String>builder()
                .result("Notification has been deleted successfully.")
                .build();
    }
}
