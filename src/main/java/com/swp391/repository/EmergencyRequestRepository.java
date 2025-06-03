package com.swp391.repository;

import com.swp391.entity.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest,Integer> {
}
