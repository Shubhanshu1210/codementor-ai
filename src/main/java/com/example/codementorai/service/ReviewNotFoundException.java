package com.example.codementorai.service;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException(Long reviewId) {
        super("Review not found: " + reviewId);
    }
}
