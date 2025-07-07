package com.swp391.controller;

import com.swp391.dto.request.NotificationRequest;
import com.swp391.dto.request.NotificationShortRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.NotificationResponse;
import com.swp391.service.AdminService;
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
    AdminService adminService;
    NotificationService notificationService;

    // STAFF tạo thông báo cho member
    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/member")
    public ApiResponse<Void> createNotificationForMember(@RequestBody NotificationRequest request) {
        notificationService.createNotificationForMember(request.getMemberId(), request.getMessage());
        return ApiResponse.<Void>builder()
                .message("Tạo thông báo cho member thành công.")
                .build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('MEMBER', 'STAFF')")
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {
        List<NotificationResponse> notifications = notificationService.getMyNotifications();
        String role = notificationService.getCurrentUserRole();

        List<String> systemTitles = List.of("Thông tin", "Thành công", "Cảnh báo", "Lỗi");

        if ("MEMBER".equals(role)) {
            notifications = notifications.stream()
                    .filter(n -> "forMember".equals(n.getTitle()) || systemTitles.contains(n.getTitle()))
                    .toList();
        } else if ("STAFF".equals(role)) {
            notifications = notifications.stream()
                    .filter(n -> "forStaff".equals(n.getTitle()) || systemTitles.contains(n.getTitle()))
                    .toList();
        }

        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notifications)
                .message("Lấy danh sách thông báo thành công.")
                .build();
    }

    // STAFF xem thông báo của 1 member cụ thể
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<List<NotificationResponse>> getByMember(@PathVariable int memberId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotificationsByMemberId(memberId))
                .message("Lấy danh sách thông báo của member thành công.")
                .build();
    }

    // STAFF xoá thông báo
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ApiResponse<String> delete(@PathVariable int id) {
        notificationService.deleteNotification(id);
        return ApiResponse.<String>builder()
                .result("Notification has been deleted successfully.")
                .message("Xoá thông báo thành công.")
                .build();
    }

    // MEMBER gửi thông báo cho staff
    @PostMapping("/to-staff")
    @PreAuthorize("hasRole('MEMBER')")
    public ApiResponse<Void> createNotificationToStaff(@RequestBody NotificationRequest request) {
        notificationService.createNotificationForStaff(request.getStaffId(), request.getMemberId(), request.getMessage());
        return ApiResponse.<Void>builder()
                .message("Thông báo đã được gửi đến staff.")
                .build();
    }

    // MEMBER gửi thông báo chỉ cho staff
    @PostMapping("/to-staff-only")
    @PreAuthorize("hasRole('MEMBER')")
    public ApiResponse<Void> createNotificationToStaffOnly(@RequestBody NotificationRequest request) {
        notificationService.createNotificationForStaffOnly(request.getStaffId(), request.getMessage());
        return ApiResponse.<Void>builder()
                .message("Thông báo đã được gửi đến staff.")
                .build();
    }

    // MEMBER hoặc STAFF mark thông báo đã đọc
    @PutMapping("/{id}/mark-as-read")
    @PreAuthorize("hasAnyRole('MEMBER', 'STAFF')")
    public ApiResponse<String> markAsRead(@PathVariable("id") int id) {
        notificationService.markAsRead(id);
        return ApiResponse.<String>builder()
                .result("Notification đã được đánh dấu là đã đọc.")
                .message("Cập nhật trạng thái thông báo thành công.")
                .build();
    }
    // MEMBER hoặc STAFF mark tất cả thông báo đã đọc
    @PutMapping("/mark-all-as-read")
    @PreAuthorize("hasRole('MEMBER') or hasRole('STAFF')")
    public ApiResponse<String> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.<String>builder()
                .result("Tất cả thông báo đã được đánh dấu là đã đọc.")
                .message("Cập nhật trạng thái tất cả thông báo thành công.")
                .build();
    }

    // Admin gửi thông báo cho tất cả member
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/all_member")
    public ApiResponse<String> sendNotificationToStaffAndMember(
            @RequestBody NotificationRequest request)
    {
        adminService.sendNotificationToAll(request.getTitle(), request.getMessage());
        return ApiResponse.<String>builder()
                .result("Notification has been sent to staff and member.")
                .build();
    }
    // All notifications for all users
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> notifications = notificationService.getAllSystemNotifications();
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notifications)
                .message("Lấy tất cả thông báo thành công.")
                .build();
    }
    // Delete notification by ID
    @DeleteMapping("/delete/group")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteNotificationGroup(
            @RequestParam String title,
            @RequestParam String message) {
        notificationService.deleteByTitleAndMessage(title, message);
        return ApiResponse.<String>builder()
                .result("Notification group deleted successfully.")
                .message("Đã xóa tất cả thông báo theo title & message.")
                .build();
    }

}
