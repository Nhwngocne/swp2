package com.swp391.repository;

import com.swp391.entity.Member;
import com.swp391.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Integer> {
    Optional<Staff> findByEmail(String email);
}
