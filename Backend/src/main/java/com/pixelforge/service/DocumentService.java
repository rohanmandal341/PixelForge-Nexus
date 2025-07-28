package com.pixelforge.service;

import com.pixelforge.entity.Document;
import com.pixelforge.entity.Project;
import com.pixelforge.entity.Role;
import com.pixelforge.entity.User;
import com.pixelforge.repository.DocumentRepository;
import com.pixelforge.repository.ProjectRepository;
import com.pixelforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepo;

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UserRepository userRepo;

    private final String uploadDir = "uploads/";

    public Document uploadDoc(MultipartFile file, Long projectId, Long userId) throws IOException {
        User uploader = userRepo.findById(userId).orElseThrow();
        Project project = projectRepo.findById(projectId).orElseThrow();

        boolean isAdmin = uploader.getRole() == Role.ADMIN;
        boolean isLeadOfProject = project.getLead().getId().equals(userId);

        if (!(isAdmin || isLeadOfProject)) {
            throw new SecurityException("You are not allowed to upload to this project");
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + filename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        Document doc = new Document();
        doc.setName(file.getOriginalFilename());
        doc.setFileUrl(path.toString());
        doc.setUploadedByUserId(userId);
        doc.setProjectId(projectId);
        doc.setUploadedAt(LocalDateTime.now());

        return documentRepo.save(doc);
    }

    public List<Document> getDocsByProject(Long projectId) {
        String requesterEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userRepo.findByEmail(requesterEmail).orElseThrow();
        Project project = projectRepo.findById(projectId).orElseThrow();

        if (requester.getRole() == Role.DEVELOPER &&
                !project.getDevelopers().contains(requester)) {
            throw new SecurityException("You are not assigned to this project");
        }

        return documentRepo.findByProjectId(projectId);
    }
}
