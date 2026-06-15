package com.expensetracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String description;
    
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;
    
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    
    @Column(name = "source_id")
    private Long sourceId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_id", insertable = false, updatable = false)
    private ExpenseSource source;
    
    @PrePersist
    void prePersist() { createdAt = updatedAt = LocalDateTime.now(); }
    
    @PreUpdate
    void preUpdate() { updatedAt = LocalDateTime.now(); }
}
