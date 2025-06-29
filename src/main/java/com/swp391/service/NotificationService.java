package com.swp391.service;

import com.swp391.dto.request.NotificationRequest;
import com.swp391.dto.response.NotificationResponse;
import com.swp391.entity.Member;
import com.swp391.entity.Notification;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.NotificationMapper;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.NotificationRepository;
import com.swp391.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationService {

    NotificationRepository notificationRepository;
    MemberRepository memberRepository;
    StaffRepository staffRepository;
    NotificationMapper notificationMapper;

    // STAFF tạo thông báo cho member
    public void createNotificationForMember(int memberId, String content) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Notification notification = Notification.builder()
                .member(member)
                .title("forMember")
                .message(content)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    // MEMBER hoặc STAFF lấy tất cả thông báo của chính mình
    public List<NotificationResponse> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Thử tìm là MEMBER
        var memberOpt = memberRepository.findByEmail(email);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            List<Notification> notifications = notificationRepository
                    .findByMemberIdOrderByCreatedAtDesc(member.getId());
            return notifications.stream()
                    .map(notificationMapper::toResponse)
                    .toList();
        }

        // Thử tìm là STAFF
        var staffOpt = staffRepository.findByEmail(email);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            List<Notification> notifications = notificationRepository
                    .findByStaffIdOrderByCreatedAtDesc(staff.getId());
            return notifications.stream()
                    .map(notificationMapper::toResponse)
                    .toList();
        }

        throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }

    // STAFF xem thông báo theo memberId
    public List<NotificationResponse> getNotificationsByMemberId(int memberId) {
        List<Notification> notifications = notificationRepository
                .findByMemberIdOrderByCreatedAtDesc(memberId);

        return notifications.stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    // STAFF xoá thông báo
    public void deleteNotification(int id) {
        notificationRepository.deleteById(id);
    }

    // MEMBER gửi thông báo cho staff
    public void createNotificationForStaff(int staffId, int memberId, String content) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Notification notification = Notification.builder()
                .staff(staff)
                .title("forStaff")
                .member(member)
                .message(content)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // Notification chỉ dành cho staff
    public void createNotificationForStaffOnly(int staffId, String content) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        Notification notification = Notification.builder()
                .staff(staff)
                .message(content)
                .title("forStaff")
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }
    public String getCurrentUserRole() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .map(granted -> granted.getAuthority())
                .filter(role -> role.startsWith("ROLE_"))
                .map(role -> role.replace("ROLE_", ""))
                .findFirst()
                .orElse(null);
    }

    // Đánh dấu 1 notification đã đọc

    public void markAsRead(int notificationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        boolean isOwner = false;
        if (notification.getMember() != null && notification.getMember().getEmail().equals(email)) {
            isOwner = true;
        }
        if (notification.getStaff() != null && notification.getStaff().getEmail().equals(email)) {
            isOwner = true;
        }

        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
    // Đánh dấu tất cả thông báo là đã đọc
    public void markAllAsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = getCurrentUserRole();

        List<Notification> notifications;

        if ("MEMBER".equals(role)) {
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            notifications = notificationRepository.findByMemberId(member.getId());

        } else if ("STAFF".equals(role)) {
            Staff staff = staffRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            notifications = notificationRepository.findByStaffId(staff.getId());

        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

   }

