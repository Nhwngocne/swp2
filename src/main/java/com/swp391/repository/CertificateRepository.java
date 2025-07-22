package com.swp391.repository;

import com.swp391.entity.Certificate;
import com.swp391.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    Optional<Certificate> findByDonationHistory_Id(int donationHistoryId);

}
