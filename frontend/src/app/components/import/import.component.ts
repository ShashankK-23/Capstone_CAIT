import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { SourceService } from '../../services/source.service';
import { Expense, Category, ExpenseSource } from '../../models/models';

@Component({
  selector: 'app-import',
  template: `
    <h2>Import Expenses from CSV</h2>
    <mat-card>
      <mat-card-content>
        <p>CSV format: <code>date,amount,description,category,source</code></p>
        <p>Date format: YYYY-MM-DD</p>
        <input type="file" accept=".csv" (change)="onFileSelect($event)">

        <div *ngIf="errors.length" class="errors">
          <mat-icon color="warn">warning</mat-icon>
          <ul><li *ngFor="let e of errors">{{e}}</li></ul>
        </div>

        <table mat-table [dataSource]="preview" *ngIf="preview.length" class="full-width">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let e">{{e.expenseDate}}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let e">₹{{e.amount}}</td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let e">{{e.description}}</td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let e">{{getCategoryName(e.categoryId)}}</td>
          </ng-container>
          <ng-container matColumnDef="source">
            <th mat-header-cell *matHeaderCellDef>Source</th>
            <td mat-cell *matCellDef="let e">{{getSourceName(e.sourceId)}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="previewColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: previewColumns;"></tr>
        </table>

        <div *ngIf="preview.length" class="actions">
          <button mat-raised-button color="primary" (click)="importAll()" [disabled]="errors.length > 0">
            Import {{preview.length}} Expenses
          </button>
          <button mat-button (click)="clear()">Clear</button>
        </div>

        <div *ngIf="importSuccess" class="success">
          <mat-icon color="primary">check_circle</mat-icon>
          Successfully imported expenses!
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width { width: 100%; margin: 16px 0; }
    .errors { color: #f44336; margin: 12px 0; }
    .errors ul { margin: 0; }
    .actions { margin-top: 16px; display: flex; gap: 8px; }
    .success { color: #4caf50; margin-top: 12px; display: flex; align-items: center; gap: 8px; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
  `]
})
export class ImportComponent implements OnInit {
  categories: Category[] = [];
  sources: ExpenseSource[] = [];
  preview: Expense[] = [];
  errors: string[] = [];
  importSuccess = false;
  previewColumns = ['date', 'amount', 'description', 'category', 'source'];

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private sourceService: SourceService
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(c => this.categories = c);
    this.sourceService.getAll().subscribe(s => this.sources = s);
  }

  onFileSelect(event: any) {
    this.importSuccess = false;
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => this.parseCSV(e.target.result);
    reader.readAsText(file);
  }

  parseCSV(content: string) {
    this.preview = [];
    this.errors = [];
    const lines = content.split('\n').filter(l => l.trim());
    const start = lines[0].toLowerCase().includes('date') ? 1 : 0;

    for (let i = start; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 3) { this.errors.push(`Row ${i + 1}: insufficient columns`); continue; }

      const [date, amount, description, categoryName, sourceName] = parts;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { this.errors.push(`Row ${i + 1}: invalid date format`); continue; }
      if (isNaN(+amount) || +amount <= 0) { this.errors.push(`Row ${i + 1}: invalid amount`); continue; }

      const cat = this.categories.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
      const src = this.sources.find(s => s.name.toLowerCase() === (sourceName || '').toLowerCase());

      if (categoryName && !cat) { this.errors.push(`Row ${i + 1}: unknown category "${categoryName}"`); continue; }

      this.preview.push({
        expenseDate: date,
        amount: +amount,
        description: description || '',
        categoryId: cat?.id || this.categories[0]?.id || 0,
        sourceId: src?.id || null
      });
    }
  }

  getCategoryName(id: number): string { return this.categories.find(c => c.id === id)?.name || ''; }
  getSourceName(id: number | null): string { return this.sources.find(s => s.id === id)?.name || ''; }

  importAll() {
    this.expenseService.importExpenses(this.preview).subscribe(() => {
      this.importSuccess = true;
      this.preview = [];
    });
  }

  clear() { this.preview = []; this.errors = []; this.importSuccess = false; }
}
