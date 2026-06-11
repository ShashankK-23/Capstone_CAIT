import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { SourceService } from '../../services/source.service';
import { Category, ExpenseSource } from '../../models/models';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Settings</h2>
    <div class="settings-grid">
      <mat-card>
        <mat-card-header><mat-card-title>Expense Categories</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="add-row">
            <mat-form-field>
              <input matInput placeholder="Name" [(ngModel)]="newCategory.name">
            </mat-form-field>
            <mat-form-field style="width:80px">
              <input matInput placeholder="Color" [(ngModel)]="newCategory.color" type="color">
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Icon" [(ngModel)]="newCategory.icon">
            </mat-form-field>
            <button mat-icon-button color="primary" (click)="addCategory()"><mat-icon>add</mat-icon></button>
          </div>
          <mat-list>
            <mat-list-item *ngFor="let c of categories">
              <mat-icon matListIcon [style.color]="c.color">{{c.icon}}</mat-icon>
              <span>{{c.name}}</span>
              <span class="spacer"></span>
              <button mat-icon-button color="warn" (click)="deleteCategory(c.id!)" [disabled]="c.isDefault">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Payment Sources</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="add-row">
            <mat-form-field>
              <input matInput placeholder="Name" [(ngModel)]="newSource.name">
            </mat-form-field>
            <button mat-icon-button color="primary" (click)="addSource()"><mat-icon>add</mat-icon></button>
          </div>
          <mat-list>
            <mat-list-item *ngFor="let s of sources">
              <span>{{s.name}}</span>
              <span class="spacer"></span>
              <button mat-icon-button color="warn" (click)="deleteSource(s.id!)" [disabled]="s.isDefault">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .add-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .spacer { flex: 1; }
    mat-list-item { display: flex; align-items: center; }
  `]
})
export class SettingsComponent implements OnInit {
  categories: Category[] = [];
  sources: ExpenseSource[] = [];
  newCategory: Category = { name: '', icon: 'label', color: '#000000' };
  newSource: ExpenseSource = { name: '' };

  constructor(private categoryService: CategoryService, private sourceService: SourceService) {}

  ngOnInit() { this.load(); }

  load() {
    this.categoryService.getAll().subscribe(c => this.categories = c);
    this.sourceService.getAll().subscribe(s => this.sources = s);
  }

  addCategory() {
    if (!this.newCategory.name) return;
    this.categoryService.create(this.newCategory).subscribe(() => {
      this.newCategory = { name: '', icon: 'label', color: '#000000' };
      this.load();
    });
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(() => this.load());
  }

  addSource() {
    if (!this.newSource.name) return;
    this.sourceService.create(this.newSource).subscribe(() => {
      this.newSource = { name: '' };
      this.load();
    });
  }

  deleteSource(id: number) {
    this.sourceService.delete(id).subscribe(() => this.load());
  }
}
