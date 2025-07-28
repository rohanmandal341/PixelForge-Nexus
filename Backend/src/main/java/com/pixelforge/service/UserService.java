package com.pixelforge.service;

import com.pixelforge.entity.Role;
import com.pixelforge.entity.User;
import com.pixelforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void updateRole(Long userId, Role newRole) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        userRepo.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepo.findByRole(role);
    }
}
