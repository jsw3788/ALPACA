package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.SolvedProblem;
import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolvedProblemRepository extends JpaRepository<SolvedProblem, Long> {

    @EntityGraph(attributePaths = "user")
    List<SolvedProblem> findAllByProblemNumber(Long problemNumber);

    List<SolvedProblem> findAllByUser(User user);
}