package com.swp391.repository;

import com.swp391.entity.BloodIntentForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloodIntentFormRepository extends JpaRepository<BloodIntentForm, Integer> {
    List<BloodIntentForm> findByMemberId(Integer memberId);
}
