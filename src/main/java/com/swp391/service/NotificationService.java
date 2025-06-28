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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationService {

    NotificationRepository notificationRepository;
    MemberRepository memberRepository;
    NotificationMapper notificationMapper;
    StaffRepository staffRepository;
    // STAFF tạo thông báo
    public void createNotificationForMember(int memberId, String content) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Notification notification = Notification.builder()
                .member(member)
                .message(content)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationRepository.save(notification);
    }
    // MEMBER lấy tất cả thông báo của chính mình
    public List<NotificationResponse> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Notification> notifications = notificationRepository
                .findByMemberIdOrderByCreatedAtDesc(member.getId());

        return notifications.stream()
                .map(notificationMapper::toResponse)
                .toList();
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
    // Notification for staff
    public void createNotificationForStaff(int staffId, int memberId, String content) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Notification notification = Notification.builder()
                .staff(staff)
                .member(member) // <--- set thêm member để tránh null
                .message(content)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }
    public void createNotificationForStaffOnly(int staffId, String content) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        Notification notification = Notification.builder()
                .staff(staff)
                .message(content)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

}
