package com.pixelforge.service;

import com.pixelforge.DTOs.AuthRequest;
import com.pixelforge.entity.User;
import com.pixelforge.repository.UserRepository;
import com.pixelforge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private AuthenticationManager authManager;

    @Autowired private JwtUtil jwtUtil;

    // Authenticates user credentials using Spring Security.
    public void authenticateUser(String email, String password) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    // Registers a new user with hashed password and default MFA enabled.
    public void registerUser(AuthRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Password hashed with BCrypt.
        user.setRole(request.getRole());
        user.setMfaEnabled(true); // MFA enabled by default.
        userRepo.save(user);
    }

    // Generates a signed JWT for authenticated user.
    public String generateJwtToken(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    // Allows user to securely change password after verifying current password.
    public void changePassword(String email, String currentPwd, String newPwd) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPwd, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPwd)); // New password hashed with BCrypt.
        userRepo.save(user);
    }

    // Enables or disables MFA for the given user.
    public void toggleMfa(String email, boolean enable) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setMfaEnabled(enable);
        userRepo.save(user);
    }

}
