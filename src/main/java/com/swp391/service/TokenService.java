package com.swp391.service;

import com.swp391.entity.Admin;
import com.swp391.entity.Member;
import com.swp391.entity.Staff;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class TokenService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    private String SECRET_KEY = "4bb6d1dfbafb64a681139d1586b6f1160d18159afd57c8c79136d7490630407c";

    private SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Tạo token cho từng loại user (Member/Staff/Admin)
    public String generateToken(Object user, String role) {
        Long userId = null;

        if (user instanceof Member) {
            userId = ((Member) user).getId();
        } else if (user instanceof Staff) {
            userId = ((Staff) user).getId();
        } else if (user instanceof Admin) {
            userId = ((Admin) user).getId();
        }

        if (userId == null) throw new RuntimeException("Invalid user type");

        return Jwts.builder()
                .subject(userId.toString())
                .claim("role", role) // phân biệt MEMBER, STAFF, ADMIN
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 day
                .signWith(getSigninKey())
                .compact();
    }

    // Lấy user theo token và role
    public Object getUserByToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String idString = claims.getSubject();
        String role = claims.get("role", String.class);
        int id = Integer.parseInt(idString);

        switch (role) {
            case "MEMBER":
                return memberRepository.findById(id).orElse(null);
            case "STAFF":
                return staffRepository.findById(id).orElse(null);
            case "ADMIN":
                return adminRepository.findById(id).orElse(null);
            default:
                return null;
        }
    }
}
