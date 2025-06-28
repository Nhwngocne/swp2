package com.swp391.repository;

import com.swp391.entity.BloodComponentCompatibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BloodComponentCompatibilityRepository extends JpaRepository<BloodComponentCompatibility, Integer> {
    @Query("""
    SELECT bcc FROM BloodComponentCompatibility bcc
    WHERE bcc.component.id = :componentId
      AND (bcc.donor.id = :bloodTypeId OR bcc.recipient.id = :bloodTypeId)
    """)
    List<BloodComponentCompatibility> findByComponentIdAndType(@Param("componentId") int componentId,
                                                               @Param("bloodTypeId") int bloodTypeId);
}
