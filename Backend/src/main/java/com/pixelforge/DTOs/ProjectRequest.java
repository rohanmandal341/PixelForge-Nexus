package com.pixelforge.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProjectRequest {
    private String name;
    private String description;
    private LocalDate deadline;
    private Long leadId;
}
