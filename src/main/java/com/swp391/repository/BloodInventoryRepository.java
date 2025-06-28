package com.swp391.repository;

import com.swp391.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Integer> {
    Optional<BloodInventory> findByBloodType_Name(String name);
}

