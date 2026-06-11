import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="logo">
          <mat-icon>account_balance_wallet</mat-icon>
          <span>Expense Tracker</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/expenses" routerLinkActive="active">
            <mat-icon matListIcon>receipt</mat-icon>
            <span>Expenses</span>
          </a>
          <a mat-list-item routerLink="/import" routerLinkActive="active">
            <mat-icon matListIcon>upload_file</mat-icon>
            <span>Import CSV</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon matListIcon>settings</mat-icon>
            <span>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Expense Tracker</span>
        </mat-toolbar>
        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 240px; }
    .logo { padding: 16px; display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 500; }
    .content { padding: 24px; }
    .active { background: rgba(0,0,0,0.04); }
  `]
})
export class LayoutComponent {}
