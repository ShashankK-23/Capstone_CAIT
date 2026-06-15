package com.expensetracker.controller;

import com.expensetracker.model.ExpenseSource;
import com.expensetracker.repository.ExpenseSourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
@RequiredArgsConstructor
public class ExpenseSourceController {
    private final ExpenseSourceRepository sourceRepo;
    private static final Long DEFAULT_USER_ID = 1L;

    @GetMapping
    public List<ExpenseSource> getAll() {
        return sourceRepo.findByUserId(DEFAULT_USER_ID);
    }

    @PostMapping
    public ExpenseSource create(@RequestBody ExpenseSource source) {
        source.setUserId(DEFAULT_USER_ID);
        source.setIsDefault(false);
        return sourceRepo.save(source);
    }

    @PutMapping("/{id}")
    public ExpenseSource update(@PathVariable Long id, @RequestBody ExpenseSource source) {
        ExpenseSource existing = sourceRepo.findById(id).orElseThrow();
        existing.setName(source.getName());
        return sourceRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sourceRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
