package com.pixelforge.service;

import com.pixelforge.entity.MFAOtp;
import com.pixelforge.repository.MFAOtpRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class MFAService {

    @Autowired private MFAOtpRepository mfaOtpRepo;
    @Autowired private JavaMailSender mailSender;

    // Generates a random 6-digit OTP, stores it with 5 min expiry, and emails it to the user.
    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        MFAOtp mfa = mfaOtpRepo.findByEmail(email).orElse(new MFAOtp());
        mfa.setEmail(email);
        mfa.setOtp(otp);
        mfa.setExpiryTime(expiry);
        mfaOtpRepo.save(mfa);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for PixelForge Login");
        message.setText("Your OTP is: " + otp + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }

    // Verifies if the OTP is correct and not expired. Deletes it after successful verification.
    public boolean verifyOtp(String email, String otp) {
        MFAOtp mfa = mfaOtpRepo.findByEmail(email).orElse(null);
        if (mfa == null || !mfa.getOtp().equals(otp)) return false;
        if (mfa.getExpiryTime().isBefore(LocalDateTime.now())) return false;

        mfaOtpRepo.delete(mfa); // OTP removed once verified.
        return true;
    }
}
