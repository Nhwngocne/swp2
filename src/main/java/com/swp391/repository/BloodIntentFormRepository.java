package com.swp391.repository;

import com.swp391.entity.BloodIntentForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodIntentFormRepository extends JpaRepository<BloodIntentForm, Integer> {
    List<BloodIntentForm> findByMemberId(Integer memberId);
}
