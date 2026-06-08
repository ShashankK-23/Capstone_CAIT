package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepo;
    private final CategoryRepository categoryRepo;

    public List<Expense> getAll(Long userId) {
        return expenseRepo.findByUserIdOrderByExpenseDateDesc(userId);
    }

    public List<Expense> getFiltered(Long userId, Long categoryId, LocalDate start, LocalDate end) {
        return expenseRepo.findFiltered(userId, categoryId, start, end);
    }

    public Expense create(Expense expense) {
        return expenseRepo.save(expense);
    }

    public Expense update(Long id, Expense data) {
        Expense existing = expenseRepo.findById(id).orElseThrow();
        existing.setAmount(data.getAmount());
        existing.setDescription(data.getDescription());
        existing.setExpenseDate(data.getExpenseDate());
        existing.setCategoryId(data.getCategoryId());
        existing.setSourceId(data.getSourceId());
        return expenseRepo.save(existing);
    }

    public void delete(Long id) {
        expenseRepo.deleteById(id);
    }

    @Transactional
    public void bulkDelete(List<Long> ids) {
        expenseRepo.deleteAllById(ids);
    }

    @Transactional
    public List<Expense> bulkUpdate(List<Expense> expenses) {
        List<Expense> updated = new ArrayList<>();
        for (Expense data : expenses) {
            Expense existing = expenseRepo.findById(data.getId()).orElseThrow();
            if (data.getCategoryId() != null) existing.setCategoryId(data.getCategoryId());
            if (data.getSourceId() != null) existing.setSourceId(data.getSourceId());
            if (data.getAmount() != null) existing.setAmount(data.getAmount());
            if (data.getDescription() != null) existing.setDescription(data.getDescription());
            if (data.getExpenseDate() != null) existing.setExpenseDate(data.getExpenseDate());
            updated.add(expenseRepo.save(existing));
        }
        return updated;
    }

    @Transactional
    public List<Expense> bulkCreate(List<Expense> expenses) {
        return expenseRepo.saveAll(expenses);
    }

    public Map<String, Object> getDashboardSummary(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Object[]> catSummary = expenseRepo.getCategorySummary(userId, start, end);
        List<Object[]> monthlySummary = expenseRepo.getMonthlySummary(userId, year);

        BigDecimal totalMonth = catSummary.stream()
                .map(r -> (BigDecimal) r[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Object[] row : catSummary) {
            Map<String, Object> item = new HashMap<>();
            Long catId = (Long) row[0];
            item.put("categoryId", catId);
            item.put("total", row[1]);
            categoryRepo.findById(catId).ifPresent(c -> {
                item.put("categoryName", c.getName());
                item.put("color", c.getColor());
                item.put("icon", c.getIcon());
            });
            categoryBreakdown.add(item);
        }

        List<Map<String, Object>> monthlyBreakdown = new ArrayList<>();
        for (Object[] row : monthlySummary) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", row[0]);
            item.put("total", row[1]);
            monthlyBreakdown.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalThisMonth", totalMonth);
        result.put("categoryBreakdown", categoryBreakdown);
        result.put("monthlyBreakdown", monthlyBreakdown);
        return result;
    }
}
