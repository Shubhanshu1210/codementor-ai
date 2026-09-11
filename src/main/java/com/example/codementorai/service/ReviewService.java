package com.example.codementorai.service;

import com.example.codementorai.dto.CodeSubmissionRequest;
import com.example.codementorai.dto.ReviewResponse;
import com.example.codementorai.entity.CodeFile;
import com.example.codementorai.entity.CodeReview;
import com.example.codementorai.entity.User;
import com.example.codementorai.repository.CodeFileRepository;
import com.example.codementorai.repository.CodeReviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final CodeFileRepository codeFileRepository;
    private final CodeReviewRepository codeReviewRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ReviewService(CodeFileRepository codeFileRepository,
                         CodeReviewRepository codeReviewRepository,
                         GeminiService geminiService,
                         ObjectMapper objectMapper) {
        this.codeFileRepository = codeFileRepository;
        this.codeReviewRepository = codeReviewRepository;
        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ReviewResponse submitCodeForReview(User user, CodeSubmissionRequest request) {
        CodeFile codeFile = new CodeFile();
        codeFile.setUser(user);
        codeFile.setFileName(request.getFileName());
        codeFile.setCode(request.getCode());
        codeFile.setLanguage(request.getLanguage());
        codeFileRepository.saveAndFlush(codeFile);

        String prompt = buildReviewPrompt(codeFile);
        CodeReview review = parseReview(geminiService.generateContent(prompt), user, codeFile);
        codeReviewRepository.save(review);

        return mapToResponse(review);
    }

    private String buildReviewPrompt(CodeFile codeFile) {
        return "You are an expert software engineer and code reviewer. Analyze the submitted code for "
                + "bugs, code smells, performance, security, best practices, and overall code quality. "
                + "Return ONLY valid JSON, with no Markdown and no code fences, using exactly this structure: "
                + "{\"bugDetection\":\"detailed findings\",\"codeSmells\":\"detailed findings\","
                + "\"performance\":\"detailed findings\",\"security\":\"detailed findings\","
                + "\"bestPractices\":\"detailed findings\",\"overallScore\":8.5}. "
                + "overallScore must be a number from 0 to 10.\n\n"
                + "File name: " + codeFile.getFileName() + "\n"
                + "Language: " + codeFile.getLanguage() + "\n"
                + "Code:\n" + codeFile.getCode();
    }

    private CodeReview parseReview(String geminiResponse, User user, CodeFile codeFile) {
        try {
            JsonNode response = objectMapper.readTree(geminiResponse);
            JsonNode textNode = response.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text");
            if (!textNode.isTextual()) {
                throw new InvalidReviewResponseException("Gemini response did not contain review text");
            }

            String json = textNode.asText().trim()
                    .replaceFirst("^```(?:json)?\\s*", "")
                    .replaceFirst("\\s*```$", "")
                    .trim();
            JsonNode reviewJson = objectMapper.readTree(json);
            String bugDetection = requiredText(reviewJson, "bugDetection");
            String codeSmells = requiredText(reviewJson, "codeSmells");
            String performance = requiredText(reviewJson, "performance");
            String security = requiredText(reviewJson, "security");
            String bestPractices = requiredText(reviewJson, "bestPractices");
            JsonNode scoreNode = reviewJson.get("overallScore");
            if (scoreNode == null || !scoreNode.isNumber()
                    || !Double.isFinite(scoreNode.doubleValue())
                    || scoreNode.doubleValue() < 0 || scoreNode.doubleValue() > 10) {
                throw new InvalidReviewResponseException("Gemini review score must be a number from 0 to 10");
            }

            CodeReview review = new CodeReview();
            review.setUser(user);
            review.setCodeFile(codeFile);
            review.setBugDetection(bugDetection);
            review.setCodeSmells(codeSmells);
            review.setPerformance(performance);
            review.setSecurity(security);
            review.setBestPractices(bestPractices);
            review.setOverallScore(scoreNode.doubleValue());
            return review;
        } catch (InvalidReviewResponseException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidReviewResponseException("Gemini returned an invalid review response", e);
        }
    }

    private String requiredText(JsonNode reviewJson, String fieldName) {
        JsonNode field = reviewJson.get(fieldName);
        if (field == null || !field.isTextual() || field.asText().isBlank()) {
            throw new InvalidReviewResponseException("Gemini review is missing field: " + fieldName);
        }
        return field.asText();
    }

    public ReviewResponse getUserReview(User user, Long reviewId) {
        CodeReview review = codeReviewRepository.findById(reviewId)
                .filter(existingReview -> existingReview.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));
        return mapToResponse(review);
    }

    public List<ReviewResponse> getUserReviews(User user) {
        return codeReviewRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(CodeReview review) {
        return new ReviewResponse(
                review.getId(),
                review.getCodeFile().getFileName(),
                review.getCodeFile().getLanguage(),
                review.getBugDetection(),
                review.getCodeSmells(),
                review.getPerformance(),
                review.getSecurity(),
                review.getBestPractices(),
                review.getOverallScore(),
                "Review completed successfully"
        );
    }
}