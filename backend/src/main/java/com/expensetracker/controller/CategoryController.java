package com.expensetracker.controller;

import com.expensetracker.model.Category;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepo;
    private static final Long DEFAULT_USER_ID = 1L;

    @GetMapping
    public List<Category> getAll() {
        return categoryRepo.findByUserId(DEFAULT_USER_ID);
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        category.setUserId(DEFAULT_USER_ID);
        category.setIsDefault(false);
        return categoryRepo.save(category);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryRepo.findById(id).orElseThrow();
        existing.setName(category.getName());
        existing.setIcon(category.getIcon());
        existing.setColor(category.getColor());
        return categoryRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
