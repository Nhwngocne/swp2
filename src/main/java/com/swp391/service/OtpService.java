package com.swp391.service;

import com.swp391.dto.request.MailBody;
import com.swp391.entity.OtpVerification;
import com.swp391.repository.OtpVerificationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpService {

    JavaMailSender javaMailSender;
    OtpVerificationRepository otpVerificationRepository;

    public String sendOtp(String email) {
        // Tạo OTP
        int otp = otpGenerator();
        Date now = new Date();
        Date expirationTime = new Date(now.getTime() + 2 * 60 * 1000); // Hết hạn sau 2 phút

        // Lưu OTP vào database
        Optional<OtpVerification> existingOtp = otpVerificationRepository.findByEmail(email);
        OtpVerification otpVerification;

        if (existingOtp.isPresent()) {
            // Cập nhật OTP hiện có
            otpVerification = existingOtp.get();
            otpVerification.setOtp(otp);
            otpVerification.setCreatedAt(now);
            otpVerification.setExpirationTime(expirationTime);
        } else {
            // Tạo OTP mới
            otpVerification = OtpVerification.builder()
                    .email(email)
                    .otp(otp)
                    .expirationTime(expirationTime)
                    .createdAt(now)
                    .build();
        }

        otpVerificationRepository.save(otpVerification);

        // Gửi email
        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("Mã OTP để xác thực đăng ký của bạn là: " + otp)
                .subject("OTP cho đăng ký tài khoản")
                .build();
        sendSimpleMessage(mailBody);

        return "OTP đã được gửi đến email!";
    }

    public String verifyOtp(Integer otp, String email) {
        OtpVerification otpVerification = otpVerificationRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy OTP cho email: " + email));

        if (otpVerification.getExpirationTime().before(new Date())) {
            throw new RuntimeException("OTP đã hết hạn.");
        }

        if (!otpVerification.getOtp().equals(otp)) {
            throw new RuntimeException("OTP không đúng.");
        }

        return "OTP xác thực thành công!";
    }

    private void sendSimpleMessage(MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("vinhhien8882004@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());
        javaMailSender.send(message);
    }

    private Integer otpGenerator() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }
}