package com.swp391.repository;

import com.swp391.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Lấy tất cả notification của member theo id, sắp xếp mới nhất trước
    List<Notification> findByMemberIdOrderByCreatedAtDesc(int memberId);

    List<Notification> findByStaffIdOrderByCreatedAtDesc(int staffId);

    @Query("SELECT n FROM Notification n " +
            "WHERE (n.member IS NOT NULL AND n.member.email = :email) " +
            "   OR (n.staff IS NOT NULL AND n.staff.email = :email)")
    List<Notification> findByEmail(@Param("email") String email);
}
