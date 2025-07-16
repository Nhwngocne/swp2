package com.swp391.repository;

import com.swp391.entity.NearbyDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NearbyDonorRepository extends JpaRepository<NearbyDonor, Integer> {
    // Truy vấn cho một nhóm máu cụ thể
    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name = :bloodType " +
            "AND d.bloodIntentForm.intentType = :intentType " +
            "AND ((:intentType = 'CHO' AND d.bloodIntentForm.status = 'COMPLETED') " +
            "OR (:intentType = 'NHAN' AND d.bloodIntentForm.status IN ('PROCESSING', 'COMPLETED'))) " +
            "AND d.bloodIntentForm.availableTo >= CURRENT_DATE")
    List<NearbyDonor> findByBloodTypeNameAndIntentTypeAndStatus(String bloodType, String intentType);

    // Truy vấn cho danh sách nhóm máu tương thích
    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name IN :bloodTypes " +
            "AND d.bloodIntentForm.intentType = :intentType " +
            "AND ((:intentType = 'CHO' AND d.bloodIntentForm.status = 'COMPLETED') " +
            "OR (:intentType = 'NHAN' AND d.bloodIntentForm.status IN ('PROCESSING', 'COMPLETED'))) " +
            "AND d.bloodIntentForm.availableTo >= CURRENT_DATE")
    List<NearbyDonor> findByBloodTypeNameInAndIntentTypeAndStatus(List<String> bloodTypes, String intentType);

    // Tìm NearbyDonor theo blood_intent_form_id
    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodIntentForm.id = :formId")
    Optional<NearbyDonor> findByBloodIntentFormId(int formId);

    // Giữ các phương thức cũ để hỗ trợ các chức năng khác nếu cần
    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name = :bloodType AND d.bloodIntentForm.intentType = :intentType")
    List<NearbyDonor> findByBloodTypeNameAndIntentType(String bloodType, String intentType);

    @Query("SELECT d FROM NearbyDonor d WHERE d.bloodType.name IN :bloodTypes AND d.bloodIntentForm.intentType = :intentType")
    List<NearbyDonor> findByBloodTypeNameInAndIntentType(List<String> bloodTypes, String intentType);
}