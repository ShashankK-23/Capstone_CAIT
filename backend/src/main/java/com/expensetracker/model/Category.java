package com.expensetracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String icon;
    private String color;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }
}
