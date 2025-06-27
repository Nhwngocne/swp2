package com.swp391.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.swp391.dto.request.ChangePassword;
import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.request.MemberUpdateRequest;
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
        member.setStatus("ACTIVE");
        try {
            member = memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return memberMapper.toMemberResponse(member);
    }

    //update member
    public MemberResponse updateMember(MemberUpdateRequest request, int id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        memberMapper.updateMember(member, request);
//        member.setPassword(passwordEncoder.encode(request.getPassword()));
        memberRepository.save(member);
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

            // 2. Always treat Google login as MEMBER
            Member member = memberRepository.findByEmail(email).orElseGet(() -> {
                Member newMember = Member.builder()
                        .email(email)
                        .name(name != null ? name : "Unknown")
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .status("ACTIVE") //  Set status for new member
                        .build();
                return memberRepository.save(newMember);
            });

            // Nếu đã tồn tại thì đảm bảo status là ACTIVE
            if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
                member.setStatus("ACTIVE");
                memberRepository.save(member);
            }

            // 3. Generate JWT token
            String token = authenticationService.generateToken(email, "MEMBER");

            // 4. Return response
            return GoogleLoginResponse.builder()
                    .authenticated(true)
                    .token(token)
                    .user(member)
                    .role("MEMBER")
                    .build();

        } catch (FirebaseAuthException e) {
            throw new AppException(ErrorCode.GOOGLE_AUTH_FAILED);
        }
    }
    //change password
    public void changePassword(String email, ChangePassword changePassword) {
        if (!changePassword.password().equals(changePassword.repeatPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
        }

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String encodedPassword = passwordEncoder.encode(changePassword.password());
        member.setPassword(encodedPassword);
        memberRepository.save(member);
    }

}
