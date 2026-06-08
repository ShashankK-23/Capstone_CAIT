package com.expensetracker.repository;

import com.expensetracker.model.ExpenseSource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseSourceRepository extends JpaRepository<ExpenseSource, Long> {
    List<ExpenseSource> findByUserId(Long userId);
}
