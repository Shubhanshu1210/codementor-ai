package com.example.codementorai.repository;

import com.example.codementorai.entity.CodeFile;
import com.example.codementorai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CodeFileRepository extends JpaRepository<CodeFile, Long> {
    List<CodeFile> findByUser(User user);
}