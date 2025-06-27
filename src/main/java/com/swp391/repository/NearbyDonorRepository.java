package com.swp391.repository;

import com.swp391.entity.NearbyDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NearbyDonorRepository extends JpaRepository<NearbyDonor, Integer> {
    @Query("SELECT d FROM NearbyDonor d WHERE (:bloodType IS NULL OR d.bloodType = :bloodType)")
    List<NearbyDonor> findByBloodType(String bloodType);
}
