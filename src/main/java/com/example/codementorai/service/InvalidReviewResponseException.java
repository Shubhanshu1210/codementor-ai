package com.example.codementorai.service;

public class InvalidReviewResponseException extends RuntimeException {
    public InvalidReviewResponseException(String message) {
        super(message);
    }

    public InvalidReviewResponseException(String message, Throwable cause) {
        super(message, cause);
    }
}
