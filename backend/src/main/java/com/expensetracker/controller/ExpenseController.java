package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;
    
    // Auth disabled: using default user id = 1
    private static final Long DEFAULT_USER_ID = 1L;

    @GetMapping
    public List<Expense> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (categoryId != null || startDate != null || endDate != null) {
            return expenseService.getFiltered(DEFAULT_USER_ID, categoryId, startDate, endDate);
        }
        return expenseService.getAll(DEFAULT_USER_ID);
    }

    @PostMapping
    public Expense create(@RequestBody Expense expense) {
        expense.setUserId(DEFAULT_USER_ID);
        return expenseService.create(expense);
    }

    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.update(id, expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<Void> bulkDelete(@RequestBody List<Long> ids) {
        expenseService.bulkDelete(ids);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/bulk-update")
    public List<Expense> bulkUpdate(@RequestBody List<Expense> expenses) {
        return expenseService.bulkUpdate(expenses);
    }

    @PostMapping("/import")
    public List<Expense> importExpenses(@RequestBody List<Expense> expenses) {
        expenses.forEach(e -> e.setUserId(DEFAULT_USER_ID));
        return expenseService.bulkCreate(expenses);
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month) {
        return expenseService.getDashboardSummary(DEFAULT_USER_ID, year, month);
    }
}
