package com.pixelforge.controller;

import com.pixelforge.DTOs.DocumentResponse;
import com.pixelforge.entity.Document;
import com.pixelforge.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Only Admins and Project Leads can upload documents for a project.
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD')")
    @PostMapping("/upload")
    public DocumentResponse uploadDoc(@RequestParam MultipartFile file,
                                      @RequestParam Long projectId,
                                      @RequestParam Long userId) throws Exception {
        Document d = documentService.uploadDoc(file, projectId, userId);
        return new DocumentResponse(d);
    }

    // All authorized roles can view documents for their assigned projects.
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD', 'DEVELOPER')")
    @GetMapping("/project/{projectId}")
    public List<DocumentResponse> getDocs(@PathVariable Long projectId) {
        return documentService.getDocsByProject(projectId)
                .stream()
                .map(DocumentResponse::new)
                .toList();
    }
}
