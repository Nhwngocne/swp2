package com.swp391.repository;

import com.swp391.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory,Integer> {
}
