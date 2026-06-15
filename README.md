# Expense Tracker

Full-stack expense tracking application built with Angular 13 + Spring Boot + MySQL.

## Project Structure

```
CAPESTONE/
├── backend/          # Spring Boot REST API
├── frontend/         # Angular 13 Material UI
└── database/         # MySQL schema & setup script
```

## Setup

### 1. Database Setup

1. Install MySQL and ensure it's running
2. Edit `database/setup_db.py` — replace placeholders:
   - `<YOUR_DB_HOST>` → e.g., `localhost`
   - `<YOUR_DB_USER>` → e.g., `root`
   - `<YOUR_DB_PASSWORD>` → your MySQL password
3. Run: `python database/setup_db.py`

### 2. Backend (Spring Boot)

1. Edit `backend/src/main/resources/application.properties` — replace DB placeholders
2. Run:
   ```
   cd backend
   mvnw spring-boot:run or .\mvnw.cmd spring-boot:run


   ```
   (or use your IDE to run `ExpenseTrackerApplication.java`)

Backend runs on `http://localhost:8080`

### 3. Frontend (Angular)

```
cd frontend
npm install
ng serve
```

Frontend runs on `http://localhost:4200`

## Features

- **Dashboard** — Monthly summary, category breakdown (doughnut chart), yearly trend (bar chart)
- **Expenses** — CRUD, filtering by category/date, bulk edit/delete, tabular view
- **CSV Import** — Upload CSV, validate, preview, bulk import
- **Settings** — Manage categories (name, icon, color) and payment sources

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List expenses (with optional filters) |
| POST | /api/expenses | Create expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| POST | /api/expenses/bulk-delete | Bulk delete |
| PUT | /api/expenses/bulk-update | Bulk update |
| POST | /api/expenses/import | Import expenses |
| GET | /api/expenses/summary | Dashboard summary |
| GET/POST/PUT/DELETE | /api/categories | Category CRUD |
| GET/POST/PUT/DELETE | /api/sources | Source CRUD |

## CSV Import Format

```csv
date,amount,description,category,source
2024-01-15,500,Lunch,Food & Dining,UPI
2024-01-16,1200,Uber ride,Transportation,Credit Card
```
