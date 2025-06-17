package com.swp391.service;

import com.swp391.dto.request.MailBody;
import com.swp391.entity.ForgotPassword;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.repository.ForgotPasswordRepository;
import com.swp391.repository.MemberRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ForgotPasswordService {
    JavaMailSender javaMailSender;
    MemberRepository memberRepository;
    ForgotPasswordRepository forgotPasswordRepository;

    public void sendSimpleMessage(MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("vinhhien8882004@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());

        javaMailSender.send(message);
    }
    public String verifyOtp(Integer otp, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));
        ForgotPassword fp = forgotPasswordRepository.findByOtpAndMember_Id(otp, member.getId())
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email: " + email));

        // Kiểm tra thời hạn OTP
        if (fp.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.deleteById(fp.getFpid());
            return "OTP has expired.";
        }

        return "OTP verified!";
    }

    public String verifyEmail(String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));

        int otp = otpGenerator();
        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("This is the OTP for your forgot password: " + otp)
                .subject("OTP for Forgot Password request")
                .build();

        ForgotPassword forgotPassword = forgotPasswordRepository.findByMember(member)
                .orElse(ForgotPassword.builder().member(member).build());

        forgotPassword.setOtp(otp);
        forgotPassword.setExpirationTime(new Date(System.currentTimeMillis() + 70 * 1000));

        sendSimpleMessage(mailBody);
        forgotPasswordRepository.save(forgotPassword);

        return "Email sent for verification!";
    }
    private Integer otpGenerator() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }


}
