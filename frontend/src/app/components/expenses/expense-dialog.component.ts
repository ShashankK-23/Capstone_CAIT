import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { Expense, Category, ExpenseSource } from '../../models/models';

@Component({
  selector: 'app-expense-dialog',
  template: `
    <h2 mat-dialog-title>{{data.bulkEdit ? 'Bulk Edit (' + data.count + ' items)' : (data.expense ? 'Edit Expense' : 'Add Expense')}}</h2>
    <mat-dialog-content>
      <mat-form-field *ngIf="!data.bulkEdit" class="full-width">
        <mat-label>Amount (₹)</mat-label>
        <input matInput type="number" [(ngModel)]="form.amount" required>
      </mat-form-field>
      <mat-form-field *ngIf="!data.bulkEdit" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput [(ngModel)]="form.description">
      </mat-form-field>
      <mat-form-field *ngIf="!data.bulkEdit" class="full-width">
        <mat-label>Expense added on</mat-label>
        <input matInput type="date" [(ngModel)]="form.expenseDate" required>
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="form.categoryId" required>
          <mat-option *ngFor="let c of data.categories" [value]="c.id">{{c.name}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>Payment Source</mat-label>
        <mat-select [(ngModel)]="form.sourceId">
          <mat-option *ngFor="let s of data.sources" [value]="s.id">{{s.name}}</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 8px; }`]
})
export class ExpenseDialogComponent {
  form: any = {};

  constructor(
    private dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private expenseService: ExpenseService
  ) {
    if (data.expense) {
      this.form = { ...data.expense };
    } else if (!data.bulkEdit) {
      this.form = {
        amount: null,
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
        categoryId: null,
        sourceId: null
      };
    }
  }

  isValid(): boolean {
    if (this.data.bulkEdit) return true;
    return this.form.amount > 0 && this.form.expenseDate && this.form.categoryId;
  }

  save() {
    if (this.data.bulkEdit) {
      const update: any = {};
      if (this.form.categoryId) update.categoryId = this.form.categoryId;
      if (this.form.sourceId) update.sourceId = this.form.sourceId;
      this.dialogRef.close(update);
    } else if (this.data.expense) {
      this.expenseService.update(this.data.expense.id, this.form).subscribe(
        () => this.dialogRef.close(true),
        err => console.error('Update failed', err)
      );
    } else {
      this.expenseService.create(this.form).subscribe(
        () => this.dialogRef.close(true),
        err => console.error('Create failed', err)
      );
    }
  }
}
