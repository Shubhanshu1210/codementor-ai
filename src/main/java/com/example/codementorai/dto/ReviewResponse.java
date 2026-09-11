package com.example.codementorai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private String fileName;
    private String language;
    private String bugDetection;
    private String codeSmells;
    private String performance;
    private String security;
    private String bestPractices;
    private Double overallScore;
    private String message;
}