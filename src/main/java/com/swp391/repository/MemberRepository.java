package com.swp391.repository;

import com.swp391.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Integer> {
    Optional<Member> findByEmail(String email);
}
