package com.example.codementorai.repository;

import com.example.codementorai.entity.CodeReview;
import com.example.codementorai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CodeReviewRepository extends JpaRepository<CodeReview, Long> {
    List<CodeReview> findByUser(User user);
}