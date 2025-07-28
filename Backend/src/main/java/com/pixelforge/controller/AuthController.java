package com.pixelforge.controller;

import com.pixelforge.DTOs.AuthRequest;
import com.pixelforge.DTOs.AuthResponse;
import com.pixelforge.DTOs.OtpRequest;
import com.pixelforge.service.AuthService;
import com.pixelforge.service.MFAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private MFAService mfaService;

    // Handles user login, verifies credentials and sends OTP for MFA.
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        authService.authenticateUser(request.getEmail(), request.getPassword());
        mfaService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to email.");
    }

    // Verifies the OTP and issues a signed JWT if valid.
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpRequest request) {
        boolean isValid = mfaService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body(null);
        }
        String token = authService.generateJwtToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // Admin-only: Registers a new user with hashed password.
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }

    // Allows authenticated users to securely change their password.
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String currentPassword,
                                                 @RequestParam String newPassword) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.changePassword(email, currentPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully.");
    }

    // Toggles MFA on or off for the authenticated user.
    @PutMapping("/toggle-mfa")
    public ResponseEntity<String> toggleMfa(@RequestParam boolean enable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.toggleMfa(email, enable);
        return ResponseEntity.ok("MFA has been " + (enable ? "enabled" : "disabled"));
    }

}
