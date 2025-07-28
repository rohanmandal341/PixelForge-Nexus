package com.pixelforge.DTOs;

import com.pixelforge.entity.Project;
import com.pixelforge.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate deadline;
    private String status;
    private String leadName;
    private List<String> developerNames;

    public ProjectResponse(Project p) {
        this.id = p.getId();
        this.name = p.getName();
        this.description = p.getDescription();
        this.deadline = p.getDeadline();
        this.status = p.getStatus().name();
        this.leadName = p.getLead() != null ? p.getLead().getName() : null;
        this.developerNames = p.getDevelopers().stream().map(User::getName).toList();
    }
}
