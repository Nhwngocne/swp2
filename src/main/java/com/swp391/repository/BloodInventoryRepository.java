package com.swp391.repository;

import com.swp391.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Integer> {
    Optional<BloodInventory> findByBloodType_Name(String name);
    List<BloodInventory> findByBloodType_NameIn(List<String> bloodTypes);

    @Query("SELECT bi.bloodType.id, SUM(bi.quantity) FROM BloodInventory bi GROUP BY bi.bloodType.id")
    List<Object[]> getTotalQuantityPerBloodType();
}

