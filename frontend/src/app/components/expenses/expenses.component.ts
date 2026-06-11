import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { SourceService } from '../../services/source.service';
import { Expense, Category, ExpenseSource } from '../../models/models';

@Component({
  selector: 'app-expenses',
  template: `
    <h2>Expenses</h2>

    <!-- Add/Edit Form -->
    <mat-card *ngIf="showForm" class="form-card">
      <mat-card-header>
        <mat-card-title>{{editingExpense ? 'Edit Expense' : 'Add Expense'}}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-row">
          <mat-form-field>
            <mat-label>Amount (₹)</mat-label>
            <input matInput type="number" [(ngModel)]="form.amount">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Description</mat-label>
            <input matInput [(ngModel)]="form.description">
          </mat-form-field>
          <mat-form-field>
            <mat-label>On</mat-label>
            <input matInput type="date" [(ngModel)]="form.expenseDate">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="form.categoryId">
              <mat-option *ngFor="let c of categories" [value]="c.id">{{c.name}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Payment Source</mat-label>
            <mat-select [(ngModel)]="form.sourceId">
              <mat-option *ngFor="let s of sources" [value]="s.id">{{s.name}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button (click)="cancelForm()">Cancel</button>
        <button mat-raised-button color="primary" (click)="saveExpense()" [disabled]="!form.amount || !form.expenseDate || !form.categoryId">
          {{editingExpense ? 'Update' : 'Save'}}
        </button>
      </mat-card-actions>
    </mat-card>

    <!-- Action Buttons -->
    <div class="toolbar" *ngIf="!showForm">
      <button mat-raised-button color="primary" (click)="openAddForm()">
        <mat-icon>add</mat-icon> Add Expense
      </button>
      <button mat-raised-button color="warn" *ngIf="selection.hasValue()" (click)="bulkDelete()">
        Delete Selected ({{selection.selected.length}})
      </button>
    </div>

    <!-- Table -->
    <table mat-table [dataSource]="expenses" class="full-width" *ngIf="expenses.length">
      <ng-container matColumnDef="select">
        <th mat-header-cell *matHeaderCellDef>
          <mat-checkbox (change)="$event ? masterToggle() : null"
            [checked]="selection.hasValue() && isAllSelected()"
            [indeterminate]="selection.hasValue() && !isAllSelected()">
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row">
          <mat-checkbox (click)="$event.stopPropagation()"
            (change)="$event ? selection.toggle(row) : null"
            [checked]="selection.isSelected(row)">
          </mat-checkbox>
        </td>
      </ng-container>
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Date</th>
        <td mat-cell *matCellDef="let e">{{e.expenseDate}}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let e">{{e.description}}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Category</th>
        <td mat-cell *matCellDef="let e">{{e.category?.name}}</td>
      </ng-container>
      <ng-container matColumnDef="source">
        <th mat-header-cell *matHeaderCellDef>Source</th>
        <td mat-cell *matCellDef="let e">{{e.source?.name}}</td>
      </ng-container>
      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef>Amount</th>
        <td mat-cell *matCellDef="let e">₹{{e.amount | number:'1.2-2'}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let e">
          <button mat-icon-button (click)="openEditForm(e)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deleteExpense(e.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <p *ngIf="!expenses.length && !showForm" class="empty">No expenses yet. Click "Add Expense" to get started.</p>
  `,
  styles: [`
    .toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
    .full-width { width: 100%; }
    .form-card { margin-bottom: 16px; }
    .form-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 150px; }
    .empty { color: #666; text-align: center; margin-top: 32px; }
  `]
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  sources: ExpenseSource[] = [];
  displayedColumns = ['select', 'date', 'description', 'category', 'source', 'amount', 'actions'];
  selection = new SelectionModel<Expense>(true, []);

  showForm = false;
  editingExpense: Expense | null = null;
  form: any = {};

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private sourceService: SourceService
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(c => this.categories = c);
    this.sourceService.getAll().subscribe(s => this.sources = s);
    this.loadExpenses();
  }

  loadExpenses() {
    this.selection.clear();
    this.expenseService.getAll().subscribe(data => this.expenses = data);
  }

  openAddForm() {
    this.editingExpense = null;
    this.form = {
      amount: null,
      description: '',
      expenseDate: new Date().toISOString().split('T')[0],
      categoryId: null,
      sourceId: null
    };
    this.showForm = true;
  }

  openEditForm(expense: Expense) {
    this.editingExpense = expense;
    this.form = { ...expense };
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingExpense = null;
  }

  saveExpense() {
    if (this.editingExpense) {
      this.expenseService.update(this.editingExpense.id!, this.form).subscribe({
        next: () => { this.showForm = false; this.editingExpense = null; this.loadExpenses(); },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.expenseService.create(this.form).subscribe({
        next: () => { this.showForm = false; this.loadExpenses(); },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  deleteExpense(id: number) {
    if (confirm('Delete this expense?')) {
      this.expenseService.delete(id).subscribe(() => this.loadExpenses());
    }
  }

  bulkDelete() {
    if (confirm(`Delete ${this.selection.selected.length} expenses?`)) {
      const ids = this.selection.selected.map(e => e.id!);
      this.expenseService.bulkDelete(ids).subscribe(() => this.loadExpenses());
    }
  }

  isAllSelected() { return this.selection.selected.length === this.expenses.length; }
  masterToggle() { this.isAllSelected() ? this.selection.clear() : this.expenses.forEach(r => this.selection.select(r)); }
}
