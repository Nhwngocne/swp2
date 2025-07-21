package com.swp391.repository;

import com.swp391.entity.Event;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByDateBefore(LocalDate date);

    @Modifying
    @Transactional
    @Query(value = "UPDATE event_registrations SET status = :status WHERE event_id = :eventId AND member_id = :memberId", nativeQuery = true)
    int updateRegistrationStatus(@Param("eventId") Long eventId,
                                 @Param("memberId") Long memberId,
                                 @Param("status") String status);

    @Query(value = "SELECT COUNT(*) FROM event_registrations WHERE event_id = :eventId AND status = :status", nativeQuery = true)
    int countRegistrationsByStatus(@Param("eventId") Long eventId, @Param("status") String status);

    List<Event> findByDate(LocalDate date);

}

