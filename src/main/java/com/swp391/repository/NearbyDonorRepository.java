package com.swp391.repository;

import com.swp391.entity.NearbyDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NearbyDonorRepository extends JpaRepository<NearbyDonor, Integer> {
    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name = :bloodType AND d.bloodIntentForm.intentType = :intentType")
    List<NearbyDonor> findByBloodTypeNameAndIntentType(String bloodType, String intentType);

    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name IN :bloodTypes AND d.bloodIntentForm.intentType = :intentType")
    List<NearbyDonor> findByBloodTypeNameInAndIntentType(List<String> bloodTypes, String intentType);
}