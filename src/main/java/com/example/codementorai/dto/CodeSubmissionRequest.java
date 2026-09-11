package com.example.codementorai.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CodeSubmissionRequest {
    @NotBlank
    private String fileName;
    @NotBlank
    private String code;
    @NotBlank
    private String language;
}