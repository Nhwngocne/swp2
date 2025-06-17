package com.swp391.repository;

import com.swp391.entity.ForgotPassword;
import com.swp391.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {
    Optional<ForgotPassword> findByOtpAndMember_Id(Integer otp, Integer member_Id);

    Optional<ForgotPassword> findByMember(Member member);
}
