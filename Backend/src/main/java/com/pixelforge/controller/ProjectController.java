package com.pixelforge.controller;

import com.pixelforge.DTOs.AssignRequest;
import com.pixelforge.DTOs.ProjectRequest;
import com.pixelforge.DTOs.ProjectResponse;
import com.pixelforge.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Admin-only: Adds a new project with name, description, and deadline.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ProjectResponse add(@RequestBody ProjectRequest req) {
        return new ProjectResponse(projectService.addProject(req));
    }

    // Admin-only: Deletes a project by ID.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return "Project deleted";
    }

    // Admins and Project Leads can mark a project as completed.
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD')")
    @PutMapping("/mark-complete/{id}")
    public String markComplete(@PathVariable Long id) {
        projectService.markCompleted(id);
        return "Project marked as completed";
    }

    // All roles can view active projects they have access to.
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD', 'DEVELOPER')")
    @GetMapping("/active")
    public List<ProjectResponse> getActive() {
        return projectService.getActiveProjects()
                .stream()
                .map(ProjectResponse::new)
                .toList();
    }

    // Project Lead-only: Assigns a developer to a project they lead.
    @PreAuthorize("hasRole('PROJECT_LEAD')")
    @PostMapping("/assign-dev")
    public String assignDevToProject(@RequestBody AssignRequest req) throws Exception {
        String leadEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        projectService.assignDeveloper(req.getProjectId(), req.getDevId(), leadEmail);
        return "Developer assigned to project";
    }
}
