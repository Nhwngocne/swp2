package com.swp391.service;

import com.swp391.dto.request.MailBody;
import com.swp391.entity.ForgotPassword;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.repository.ForgotPasswordRepository;
import com.swp391.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
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
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(mailBody.to());
            helper.setFrom("vinhhien8882004@gmail.com");
            helper.setSubject(mailBody.subject());
            helper.setText(mailBody.text(), true); // true để render HTML
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    public String verifyOtp(Integer otp, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));
        ForgotPassword fp = forgotPasswordRepository.findByOtpAndMember_Id(otp, member.getId())
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email: " + email));

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

        // Đọc HTML template và replace OTP
        String html;
        try {
            String templatePath = "src/main/resources/templates/otp_forgot_password.html";
            String htmlTemplate = Files.readString(Paths.get(templatePath));
            html = htmlTemplate.replace("${otp}", String.valueOf(otp));
        } catch (IOException e) {
            throw new RuntimeException("Không đọc được file template OTP email", e);
        }

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("OTP for Forgot Password request")
                .text(html)
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
