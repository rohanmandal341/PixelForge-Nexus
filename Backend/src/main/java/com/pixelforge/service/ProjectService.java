package com.pixelforge.service;

import com.pixelforge.DTOs.ProjectRequest;
import com.pixelforge.entity.Project;
import com.pixelforge.entity.Role;
import com.pixelforge.entity.User;
import com.pixelforge.repository.ProjectRepository;
import com.pixelforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UserRepository userRepo;

    // Adds a new project with required details and assigned Project Lead.
    public Project addProject(ProjectRequest req) {
        Project p = new Project();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setDeadline(req.getDeadline());
        p.setStatus(Project.Status.ACTIVE);

        if (req.getLeadId() != null) {
            User lead = userRepo.findById(req.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead user not found"));
            p.setLead(lead);
        } else {
            throw new RuntimeException("Lead ID is required when creating a project");
        }

        return projectRepo.save(p);
    }

    // Admin-only: Deletes a project by ID.
    public void deleteProject(Long id) {
        projectRepo.deleteById(id);
    }

    // Marks a project as completed (Admin or Project Lead).
    public void markCompleted(Long id) {
        Project p = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        p.setStatus(Project.Status.COMPLETED);
        projectRepo.save(p);
    }

    // Returns active projects based on user role: Developer, Project Lead, or Admin.
    public List<Project> getActiveProjects() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        if (user.getRole() == Role.DEVELOPER) {
            return projectRepo.findByDevelopersEmail(email);
        } else if (user.getRole() == Role.PROJECT_LEAD) {
            return projectRepo.findByLeadEmail(email);
        } else {
            return projectRepo.findByStatus(Project.Status.ACTIVE);
        }
    }

    // Project Lead-only: Assigns a Developer to their own project.
    public void assignDeveloper(Long projectId, Long developerId, String leadEmail) throws AccessDeniedException {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getLead().getEmail().equals(leadEmail)) {
            throw new AccessDeniedException("You can only assign to your own projects");
        }

        User developer = userRepo.findById(developerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (developer.getRole() != Role.DEVELOPER) {
            throw new IllegalArgumentException("Can only assign developers");
        }

        project.getDevelopers().add(developer);
        projectRepo.save(project);
    }

    // Helper: Returns projects led by a specific Project Lead.
    public List<Project> getProjectsLedBy(String leadEmail) {
        return projectRepo.findByLeadEmail(leadEmail);
    }

    // Helper: Returns projects assigned to a specific Developer.
    public List<Project> getProjectsForDeveloper(String email) {
        return projectRepo.findByDevelopersEmail(email);
    }
}
