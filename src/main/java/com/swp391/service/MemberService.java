package com.swp391.service;

import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.response.MemberResponse;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.MemberMapper;
import com.swp391.repository.MemberRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MemberService{
    MemberRepository memberRepository;
    MemberMapper memberMapper;
    PasswordEncoder passwordEncoder;

    //create member
    public MemberResponse createMember(MemberCreateRequest request){
        Member member = memberMapper.toMember(request);
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        try{
            member = memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return memberMapper.toMemberResponse(member);
    }
    //update member
    public MemberResponse updateMember(MemberCreateRequest request, int id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        memberMapper.updateMember(member, request);
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        return memberMapper.toMemberResponse(member);
    }
    //delete member
    public void deleteMember(int id){
        memberRepository.deleteById(id);
    }
    //get all members
    public List<MemberResponse> getAllMembers(){
        return memberRepository.findAll().stream().map(memberMapper::toMemberResponse).toList();
    }
    //get member by id
    public MemberResponse getMemberById(int id){
            Member member = memberRepository.findById(id)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return memberMapper.toMemberResponse(member);
    }







}
