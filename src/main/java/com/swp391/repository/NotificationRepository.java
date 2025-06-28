package com.swp391.repository;

import com.swp391.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Lấy tất cả notification của member theo id, sắp xếp mới nhất trước
    List<Notification> findByMemberIdOrderByCreatedAtDesc(int memberId);
}
