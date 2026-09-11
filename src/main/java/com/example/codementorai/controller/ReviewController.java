package com.example.codementorai.controller;

import com.example.codementorai.dto.CodeSubmissionRequest;
import com.example.codementorai.dto.ReviewResponse;
import com.example.codementorai.entity.User;
import com.example.codementorai.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ReviewResponse> submitCodeForReview(
            @Valid @RequestBody CodeSubmissionRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        ReviewResponse response = reviewService.submitCodeForReview(user, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReviewResponse>> getReviewHistory(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<ReviewResponse> reviews = reviewService.getUserReviews(user);

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReview(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(reviewService.getUserReview(user, id));
    }
}