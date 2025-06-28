package com.swp391.repository;

import com.swp391.entity.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloodTypeRepository extends JpaRepository<BloodType, Integer> {
    Optional<BloodType> findByName(String Name);
    List<BloodType> findAllByNameIn(List<String> names);
}