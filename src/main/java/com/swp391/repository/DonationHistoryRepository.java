package com.swp391.repository;

import com.swp391.entity.DonationHistory;
import org.antlr.v4.runtime.atn.SemanticContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory,Integer> {
    List<DonationHistory> findByMemberId(int memberId);
    List<DonationHistory> findByMemberIdAndResult(int memberId, String result);
    @Query("SELECT d FROM DonationHistory d WHERE d.event.id = :eventId AND LOWER(TRIM(d.result)) = LOWER(:result)")
    List<DonationHistory> findByEventIdAndResultIgnoreCase(
            @Param("eventId") Long eventId,
            @Param("result") String result);

}
