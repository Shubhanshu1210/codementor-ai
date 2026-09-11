package com.example.codementorai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "code_file_id", nullable = false)
    private CodeFile codeFile;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bugDetection;

    @Column(columnDefinition = "TEXT")
    private String codeSmells;

    @Column(columnDefinition = "TEXT")
    private String performance;

    @Column(columnDefinition = "TEXT")
    private String security;

    @Column(columnDefinition = "TEXT")
    private String bestPractices;

    @Column(nullable = false)
    private Double overallScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}