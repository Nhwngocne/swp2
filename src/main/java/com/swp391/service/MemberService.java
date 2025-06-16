package com.swp391.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.response.GoogleLoginResponse;
import com.swp391.dto.response.MemberResponse;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.MemberMapper;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MemberService{
    MemberRepository memberRepository;
    MemberMapper memberMapper;
    StaffRepository staffRepository;
    AdminRepository adminRepository;
    PasswordEncoder passwordEncoder;
    AuthenticationService authenticationService;

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
    public GoogleLoginResponse loginWithGoogle(String idToken) {
        try {
            // 1. Verify Firebase token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            // 2. Determine user type and role
            Object user;
            String role;

            if (adminRepository.findByEmail(email).isPresent()) {
                user = adminRepository.findByEmail(email).get();
                role = "ADMIN";
            } else if (staffRepository.findByEmail(email).isPresent()) {
                user = staffRepository.findByEmail(email).get();
                role = "STAFF";
            } else {
                // If not admin or staff, treat as member
                user = memberRepository.findByEmail(email).orElseGet(() -> {
                    Member newMember = Member.builder()
                            .email(email)
                            .name(name != null ? name : "Unknown")
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .build();
                    return memberRepository.save(newMember);
                });
                role = "MEMBER";
            }

            // 3. Generate JWT token
            String token = authenticationService.generateToken(email, role);

            // 4. Return response
            return GoogleLoginResponse.builder()
                    .authenticated(true)
                    .token(token)
                    .user(user)
                    .role(role)
                    .build();

        } catch (FirebaseAuthException e) {
            throw new AppException(ErrorCode.GOOGLE_AUTH_FAILED);
        }
    }


}
