package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);
    
    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            Long userId, LocalDate start, LocalDate end);
    
    List<Expense> findByUserIdAndCategoryIdOrderByExpenseDateDesc(Long userId, Long categoryId);
    
    @Query("SELECT e FROM Expense e WHERE e.userId = :userId " +
           "AND (:categoryId IS NULL OR e.categoryId = :categoryId) " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "ORDER BY e.expenseDate DESC")
    List<Expense> findFiltered(@Param("userId") Long userId,
                               @Param("categoryId") Long categoryId,
                               @Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e.categoryId, SUM(e.amount) FROM Expense e " +
           "WHERE e.userId = :userId AND e.expenseDate BETWEEN :start AND :end " +
           "GROUP BY e.categoryId")
    List<Object[]> getCategorySummary(@Param("userId") Long userId,
                                      @Param("start") LocalDate start,
                                      @Param("end") LocalDate end);
    
    @Query("SELECT MONTH(e.expenseDate), SUM(e.amount) FROM Expense e " +
           "WHERE e.userId = :userId AND YEAR(e.expenseDate) = :year " +
           "GROUP BY MONTH(e.expenseDate) ORDER BY MONTH(e.expenseDate)")
    List<Object[]> getMonthlySummary(@Param("userId") Long userId, @Param("year") int year);
}
