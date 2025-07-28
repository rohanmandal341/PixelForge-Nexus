package com.pixelforge.controller;

import com.pixelforge.DTOs.UpdateRoleRequest;
import com.pixelforge.DTOs.UserResponseDTO;
import com.pixelforge.entity.Role;
import com.pixelforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Admin-only: Returns all registered users with their details.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(UserResponseDTO::new)
                .toList();
    }

    // Admin-only: Updates a user's role (e.g., Developer → Project Lead).
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update-role/{id}")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody UpdateRoleRequest req) {
        userService.updateRole(id, req.getRole());
        return ResponseEntity.ok("Role updated");
    }

    // Admins and Project Leads can view users by specific role.
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD')")
    @GetMapping("/role/{role}")
    public List<UserResponseDTO> getByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role)
                .stream()
                .map(UserResponseDTO::new)
                .toList();
    }
}
