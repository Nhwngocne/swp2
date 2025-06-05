package com.swp391.service;

import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.response.MemberResponse;
import com.swp391.entity.Member;
import com.swp391.mapper.MemberMapper;
import com.swp391.repository.MemberRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MemberService{
    MemberRepository memberRepository;
    MemberMapper memberMapper;
    PasswordEncoder passwordEncoder;

    public MemberResponse createMember(MemberCreateRequest request){
        Member member = memberMapper.toMember(request);
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        try{
            member = memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            //throw new AppException(ErrorCode.USER_EXISTED);
            throw new RuntimeException(e);
        }
        return memberMapper.toMemberResponse(member);
    }



}
