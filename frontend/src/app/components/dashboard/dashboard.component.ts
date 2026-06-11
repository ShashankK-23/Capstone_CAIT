import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { DashboardSummary } from '../../models/models';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>Dashboard</h2>
    <div class="summary-cards">
      <mat-card>
        <mat-card-header><mat-card-title>Total This Month</mat-card-title></mat-card-header>
        <mat-card-content><h1>₹{{summary?.totalThisMonth || 0 | number:'1.2-2'}}</h1></mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Categories Spent In ({{monthNames[currentMonth-1]}})</mat-card-title></mat-card-header>
        <mat-card-content><h1>{{summary?.categoryBreakdown?.length || 0}}</h1></mat-card-content>
      </mat-card>
    </div>

    <div class="charts-row">
      <mat-card class="chart-card">
        <mat-card-header><mat-card-title>Category Breakdown</mat-card-title></mat-card-header>
        <mat-card-content>
          <canvas *ngIf="pieChartData" baseChart
            [data]="pieChartData" [type]="'doughnut'" [options]="pieOptions">
          </canvas>
        </mat-card-content>
      </mat-card>
      <mat-card class="chart-card">
        <mat-card-header><mat-card-title>Monthly Trend ({{currentYear}})</mat-card-title></mat-card-header>
        <mat-card-content>
          <canvas *ngIf="barChartData" baseChart
            [data]="barChartData" [type]="'bar'" [options]="barOptions">
          </canvas>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="month-selector">
      <button mat-icon-button (click)="changeMonth(-1)"><mat-icon>chevron_left</mat-icon></button>
      <span>{{monthNames[currentMonth-1]}} {{currentYear}}</span>
      <button mat-icon-button (click)="changeMonth(1)"><mat-icon>chevron_right</mat-icon></button>
    </div>
  `,
  styles: [`
    .summary-cards { display: flex; gap: 16px; margin-bottom: 24px; }
    .summary-cards mat-card { flex: 1; }
    .summary-cards h1 { font-size: 2rem; margin: 8px 0; }
    .charts-row { display: flex; gap: 16px; margin-bottom: 16px; }
    .chart-card { flex: 1; min-height: 300px; }
    .month-selector { display: flex; align-items: center; gap: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  pieChartData: any;
  barChartData: any;
  pieOptions: ChartConfiguration['options'] = { responsive: true };
  barOptions: ChartConfiguration['options'] = { responsive: true, scales: { y: { beginAtZero: true } } };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() { this.loadSummary(); }

  loadSummary() {
    this.expenseService.getSummary(this.currentYear, this.currentMonth).subscribe(data => {
      this.summary = data;
      this.buildCharts();
    });
  }

  buildCharts() {
    if (!this.summary) return;
    this.pieChartData = {
      labels: this.summary.categoryBreakdown.map(c => c.categoryName),
      datasets: [{
        data: this.summary.categoryBreakdown.map(c => c.total),
        backgroundColor: this.summary.categoryBreakdown.map(c => c.color)
      }]
    };
    const months = Array(12).fill(0);
    this.summary.monthlyBreakdown.forEach(m => months[m.month - 1] = m.total);
    this.barChartData = {
      labels: this.monthNames,
      datasets: [{ label: 'Expenses', data: months, backgroundColor: '#3f51b5' }]
    };
  }

  changeMonth(delta: number) {
    this.currentMonth += delta;
    if (this.currentMonth > 12) { this.currentMonth = 1; this.currentYear++; }
    if (this.currentMonth < 1) { this.currentMonth = 12; this.currentYear--; }
    this.loadSummary();
  }
}
