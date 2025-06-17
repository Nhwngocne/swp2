package com.swp391.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swp391.dto.request.AuthenticationRequest;
import com.swp391.dto.request.IntrospectRequest;
import com.swp391.dto.request.LogoutRequest;
import com.swp391.dto.request.RefreshRequest;
import com.swp391.dto.response.AuthenticationResponse;
import com.swp391.dto.response.IntrospectResponse;
import com.swp391.entity.Admin;
import com.swp391.entity.InvalidatedToken;
import com.swp391.entity.Member;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.repository.AdminRepository;
import com.swp391.repository.InvalidatedTokenRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    MemberRepository memberRepository;
    StaffRepository staffRepository;
    AdminRepository adminRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder encoder = new BCryptPasswordEncoder(10);
        Object user;
        String role;

        // Tự động xác định role dựa vào username
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            user = memberRepository.findByEmail(request.getEmail()).get();
            role = "MEMBER";
        } else if (staffRepository.findByEmail(request.getEmail()).isPresent()) {
            user = staffRepository.findByEmail(request.getEmail()).get();
            role = "STAFF";
        } else if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            user = adminRepository.findByEmail(request.getEmail()).get();
            role = "ADMIN";
        } else {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        String password = switch (role) {
            case "MEMBER" -> ((Member) user).getPassword();
            case "STAFF" -> ((Staff) user).getPassword();
            case "ADMIN" -> ((Admin) user).getPassword();
            default -> throw new RuntimeException("Unknown role");
        };

        if (!encoder.matches(request.getPassword(), password)) {
            log.info("weak password for user: {}", request.getEmail());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String token = generateToken(request.getEmail(), role);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(token)
                .user(user)
                .role(role)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

   public String generateToken(String email, String role) {
        try {
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .issuer("swp391.com")
                    .issueTime(new Date())
                    .expirationTime(Date.from(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS)))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", buildScope(role))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS512),
                    claimsSet
            );

            signedJWT.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return signedJWT.serialize();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        //xác thực chữ ký của token
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
    private String buildScope(String role) {
        return "ROLE_" + role;
    }

    public AuthenticationResponse getCurrentUserFromToken(String token) throws ParseException, JOSEException {
        SignedJWT jwt = verifyToken(token, false);
        String email = jwt.getJWTClaimsSet().getSubject();
        String scope = jwt.getJWTClaimsSet().getStringClaim("scope"); // "ROLE_STAFF"
        String role = scope.replace("ROLE_", ""); // "STAFF"

        Object user = switch (role) {
            case "MEMBER" -> memberRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            case "STAFF" -> staffRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            case "ADMIN" -> adminRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            default -> throw new AppException(ErrorCode.UNAUTHENTICATED);
        };
        return AuthenticationResponse.builder()
                .user(user)
                .token(token)
                .role(role)
                .authenticated(true)
                .build();
    }
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        // Lưu token cũ vào bảng invalidated
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
        invalidatedTokenRepository.save(invalidatedToken);

        // Lấy email và scope (để xác định role)
        var email = signedJWT.getJWTClaimsSet().getSubject();
        var scope = signedJWT.getJWTClaimsSet().getStringClaim("scope"); // VD: "ROLE_MEMBER"
        var role = scope.replace("ROLE_", ""); // VD: "MEMBER"

        Object user = switch (role) {
            case "MEMBER" -> memberRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            case "STAFF" -> staffRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            case "ADMIN" -> adminRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            default -> throw new AppException(ErrorCode.UNAUTHENTICATED);
        };

        var newToken = generateToken(email, role);

        return AuthenticationResponse.builder().token(newToken).authenticated(true).build();
    }
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), false);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }
}
