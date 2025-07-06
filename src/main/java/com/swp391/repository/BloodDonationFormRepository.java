package com.swp391.repository;

import com.swp391.entity.BloodDonationForm;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391.entity.BloodDonationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodDonationFormRepository extends JpaRepository<BloodDonationForm, Integer> {

    List<BloodDonationForm> findByEventId(int eventId);

    List<BloodDonationForm> findByMemberId(int memberId);
    int countByEventIdAndStatus(int eventId, String status);
}

