package com.pixelforge.DTOs;

import com.pixelforge.entity.Document;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private Long id;
    private String name;
    private String fileUrl;
    private Long uploadedByUserId;
    private LocalDateTime uploadedAt;

    public DocumentResponse(Document doc) {
        this.id = doc.getId();
        this.name = doc.getName();
        this.fileUrl = doc.getFileUrl();
        this.uploadedByUserId = doc.getUploadedByUserId();
        this.uploadedAt = doc.getUploadedAt();
    }
}
