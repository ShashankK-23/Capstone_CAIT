# CAPSTONE_CAIT: Expense Tracker - Complete Project Documentation

**Date Generated:** June 15, 2026  
**Repository:** [ShashankK-23/Capstone_CAIT](https://github.com/ShashankK-23/Capstone_CAIT)  
**Project Type:** Full-Stack Web Application

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [Java Entity Models](#5-java-entity-models)
6. [REST API Endpoints](#6-rest-api-endpoints)
7. [CSV Import Specification](#7-csv-import-specification)
8. [Frontend Components](#8-frontend-components)
9. [Deployment & Setup](#9-deployment--setup)
10. [Features & Functionality](#10-features--functionality)
11. [Technical Considerations](#11-technical-considerations)
12. [Configuration Files](#12-configuration-files)
13. [Quick Start Guide](#13-quick-start-guide)
14. [Project Structure](#14-project-structure-summary)
15. [API Testing](#15-api-testing-with-curl-examples)
16. [Troubleshooting](#16-troubleshooting)
17. [Future Enhancements](#17-future-enhancements)

---

## 1. PROJECT OVERVIEW

**Project Name:** Expense Tracker  
**Repository:** ShashankK-23/Capstone_CAIT  
**Type:** Full-Stack Web Application  
**Purpose:** A comprehensive expense tracking application that helps users manage, categorize, and analyze their spending patterns with visual dashboards and CSV import capabilities.

### Key Features at a Glance
- Complete expense lifecycle management (Create, Read, Update, Delete)
- Advanced filtering and bulk operations
- Visual analytics with charts and graphs
- CSV bulk import functionality
- Category and payment source management
- Dashboard with monthly and yearly summaries

---

## 2. TECH STACK

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **ORM:** Spring Data JPA (Hibernate)
- **Database Driver:** MySQL Connector Java
- **Build Tool:** Maven
- **Environment Management:** spring-dotenv 4.0.0
- **Utilities:** Lombok (for reducing boilerplate)

### Frontend
- **Framework:** Angular 21.2.0
- **Language:** TypeScript 5.9.2
- **UI Library:** Angular Material
- **HTTP Client:** @angular/common/http
- **Charts:** ng2-charts
- **Build Tool:** Angular CLI 21.2.15
- **Server:** Express.js 5.1.0
- **SSR:** Angular Server-Side Rendering
- **Testing:** Vitest 4.0.8, Jasmine

### Database
- **DBMS:** MySQL
- **Schema Management:** Manual SQL scripts with Python setup utility

### Language Composition
- TypeScript: 64.4%
- Java: 29.3%
- Python: 2.8% (database setup scripts)
- JavaScript: 2.3%
- HTML: 0.8%
- SCSS: 0.3%
- CSS: 0.1%

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture Diagram

```
CLIENT LAYER (Angular 21)
├── Dashboard Component (Analytics & Visualization)
├── Expenses Component (CRUD Operations)
├── Settings Component (Configuration Management)
├── Import Component (CSV Import)
└── Layout Component (Navigation & UI Shell)
                ↓ HTTP REST
API GATEWAY / REST LAYER (Spring Boot 3.2)
├── ExpenseController (Expense CRUD & Bulk Ops)
├── CategoryController (Category Management)
├── ExpenseSourceController (Source Management)
├── ExpenseService (Business Logic)
└── Repositories (Data Access)
                ↓ JDBC
DATA ACCESS LAYER (Hibernate / JPA)
└── Entity Models
                ↓ SQL
DATABASE LAYER (MySQL)
├── users
├── expenses
├── categories
└── expense_sources
```

### 3.2 Request-Response Flow

1. **Frontend UI** → User initiates action (add/edit/delete expense)
2. **HTTP Request** → Angular component sends HTTP request to backend API
3. **Controller** → Spring Controller receives and validates request
4. **Service Layer** → Business logic processes the request
5. **Repository** → Data access layer interacts with database
6. **Database** → MySQL executes query and returns data
7. **Response Chain** → Data flows back through service → controller → HTTP response
8. **Frontend Update** → Angular updates component state and refreshes UI

### 3.3 Technology Interaction Flow

- **Browser** (HTTP) ↔ **Angular Frontend** (TypeScript/Material)
- **Angular Frontend** (HTTP/REST) ↔ **Spring Boot Backend** (Java/JPA)
- **Spring Boot Backend** (JDBC) ↔ **MySQL Database** (SQL)
- **Configuration** via `.env` file (Environment Variables)

---

## 4. DATABASE SCHEMA

### 4.1 Entity-Relationship Diagram

```
USERS (1) ──────────────────┐
  ├── id (PK)               │
  ├── email (Unique)        │ (1:N)
  ├── username              │
  ├── password_hash         │
  ├── firebase_uid          │
  ├── created_at            │
  └── updated_at            │
                            ↓
CATEGORIES (N)          EXPENSES (N)    EXPENSE_SOURCES (N)
  ├── id (PK)             ├── id (PK)      ├── id (PK)
  ├── name                ├── amount       ├── name
  ├── icon                ├── description  ├── user_id (FK)
  ├── color               ├── expense_date ├── is_default
  ├── user_id (FK)        ├── category_id  └── created_at
  ├── is_default          ├── source_id
  └── created_at          ├── user_id (FK)
                          ├── created_at
                          └── updated_at
```

### 4.2 Table Definitions

#### USERS Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### CATEGORIES Table
```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    user_id BIGINT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### EXPENSE_SOURCES Table
```sql
CREATE TABLE expense_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### EXPENSES Table
```sql
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(500),
    expense_date DATE NOT NULL,
    category_id BIGINT NOT NULL,
    source_id BIGINT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (source_id) REFERENCES expense_sources(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.3 Default Data

**Default User:**
- ID: 1
- Email: default@example.com
- Username: Default User

**Default Categories (8 total):**
1. Food & Dining (restaurant, #FF5722)
2. Transportation (directions_car, #2196F3)
3. Shopping (shopping_cart, #9C27B0)
4. Entertainment (movie, #FF9800)
5. Bills & Utilities (receipt_long, #607D8B)
6. Health (local_hospital, #4CAF50)
7. Education (school, #3F51B5)
8. Others (more_horiz, #795548)

**Default Expense Sources (5 total):**
1. Cash
2. Credit Card
3. Debit Card
4. UPI
5. Net Banking

---

## 5. JAVA ENTITY MODELS

### 5.1 User Entity

```java
@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String username;
    
    private String passwordHash;
    private String firebaseUid;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    void prePersist() { 
        createdAt = updatedAt = LocalDateTime.now(); 
    }
    
    @PreUpdate
    void preUpdate() { 
        updatedAt = LocalDateTime.now(); 
    }
}
```

**Fields Explanation:**
- `id`: Auto-generated unique identifier
- `email`: Unique email address for login/identification
- `username`: Display name for the user
- `passwordHash`: Hash of user password (not currently used)
- `firebaseUid`: Firebase authentication UID for OAuth integration
- `createdAt`: Record creation timestamp (immutable)
- `updatedAt`: Last update timestamp

### 5.2 Category Entity

```java
@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String icon;
    private String color;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    void prePersist() { 
        createdAt = LocalDateTime.now(); 
    }
}
```

**Fields Explanation:**
- `id`: Auto-generated unique identifier
- `name`: Category name (e.g., "Food & Dining")
- `icon`: Material icon name for UI display
- `color`: Hex color code for UI representation
- `userId`: Foreign key linking to users table
- `isDefault`: Boolean indicating if this is a default category
- `createdAt`: Record creation timestamp

### 5.3 ExpenseSource Entity

```java
@Entity
@Table(name = "expense_sources")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseSource {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    void prePersist() { 
        createdAt = LocalDateTime.now(); 
    }
}
```

**Fields Explanation:**
- `id`: Auto-generated unique identifier
- `name`: Source name (e.g., "Credit Card", "Cash")
- `userId`: Foreign key linking to users table
- `isDefault`: Boolean indicating if this is a default source
- `createdAt`: Record creation timestamp

### 5.4 Expense Entity

```java
@Entity
@Table(name = "expenses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String description;
    
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;
    
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    
    @Column(name = "source_id")
    private Long sourceId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_id", insertable = false, updatable = false)
    private ExpenseSource source;
    
    @PrePersist
    void prePersist() { 
        createdAt = updatedAt = LocalDateTime.now(); 
    }
    
    @PreUpdate
    void preUpdate() { 
        updatedAt = LocalDateTime.now(); 
    }
}
```

**Fields Explanation:**
- `id`: Auto-generated unique identifier
- `amount`: Expense amount (BigDecimal for precision)
- `description`: Optional description of the expense
- `expenseDate`: Date when the expense occurred
- `categoryId`: Foreign key to categories table
- `sourceId`: Foreign key to expense_sources table
- `userId`: Foreign key to users table
- `createdAt`: Record creation timestamp (immutable)
- `updatedAt`: Last update timestamp
- `category`: Lazy-loaded reference to Category entity
- `source`: Lazy-loaded reference to ExpenseSource entity

---

## 6. REST API ENDPOINTS

### 6.1 Base URL
```
http://localhost:8080/api
```

### 6.2 Expense Endpoints

#### GET /expenses
**Description:** Retrieve all expenses or filter by category and date range

**Query Parameters:**
- `categoryId` (optional): Filter by specific category ID
- `startDate` (optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (optional): End date for filtering (YYYY-MM-DD format)

**Example Request:**
```
GET /api/expenses?categoryId=1&startDate=2024-01-01&endDate=2024-01-31
```

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "amount": 500.00,
    "description": "Lunch at restaurant",
    "expenseDate": "2024-01-15",
    "categoryId": 1,
    "sourceId": 1,
    "userId": 1,
    "createdAt": "2024-01-15T12:30:00",
    "updatedAt": "2024-01-15T12:30:00",
    "category": {
      "id": 1,
      "name": "Food & Dining",
      "icon": "restaurant",
      "color": "#FF5722",
      "userId": 1,
      "isDefault": true,
      "createdAt": "2024-01-01T10:00:00"
    },
    "source": {
      "id": 1,
      "name": "Cash",
      "userId": 1,
      "isDefault": true,
      "createdAt": "2024-01-01T10:00:00"
    }
  }
]
```

#### POST /expenses
**Description:** Create a new expense

**Request Body:**
```json
{
  "amount": 500.00,
  "description": "Lunch at restaurant",
  "expenseDate": "2024-01-15",
  "categoryId": 1,
  "sourceId": 1
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "amount": 500.00,
  "description": "Lunch at restaurant",
  "expenseDate": "2024-01-15",
  "categoryId": 1,
  "sourceId": 1,
  "userId": 1,
  "createdAt": "2024-01-15T12:30:00",
  "updatedAt": "2024-01-15T12:30:00"
}
```

#### PUT /expenses/{id}
**Description:** Update an existing expense

**URL Parameter:** `id` - Expense ID to update

**Request Body:**
```json
{
  "amount": 600.00,
  "description": "Updated lunch description",
  "expenseDate": "2024-01-15",
  "categoryId": 2,
  "sourceId": 2
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "amount": 600.00,
  "description": "Updated lunch description",
  "expenseDate": "2024-01-15",
  "categoryId": 2,
  "sourceId": 2,
  "userId": 1,
  "createdAt": "2024-01-15T12:30:00",
  "updatedAt": "2024-01-15T14:45:00"
}
```

#### DELETE /expenses/{id}
**Description:** Delete a specific expense by ID

**URL Parameter:** `id` - Expense ID to delete

**Response: 204 No Content**

#### POST /expenses/bulk-delete
**Description:** Delete multiple expenses at once

**Request Body:**
```json
[1, 2, 3, 4, 5]
```

**Response: 204 No Content**

#### PUT /expenses/bulk-update
**Description:** Update multiple expenses in a single request

**Request Body:**
```json
[
  {
    "id": 1,
    "amount": 600.00,
    "categoryId": 2
  },
  {
    "id": 2,
    "description": "Updated description"
  }
]
```

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "amount": 600.00,
    "categoryId": 2,
    "description": "Lunch at restaurant",
    "expenseDate": "2024-01-15",
    "sourceId": 1,
    "userId": 1,
    "createdAt": "2024-01-15T12:30:00",
    "updatedAt": "2024-01-15T14:45:00"
  },
  {
    "id": 2,
    "description": "Updated description",
    ...
  }
]
```

#### POST /expenses/import
**Description:** Bulk import expenses from CSV data

**Request Body:**
```json
[
  {
    "amount": 500.00,
    "description": "Lunch",
    "expenseDate": "2024-01-15",
    "categoryId": 1,
    "sourceId": 1
  },
  {
    "amount": 1200.00,
    "description": "Uber ride",
    "expenseDate": "2024-01-16",
    "categoryId": 2,
    "sourceId": 2
  }
]
```

**Response: 200 OK**
```json
[
  {
    "id": 10,
    "amount": 500.00,
    "description": "Lunch",
    "expenseDate": "2024-01-15",
    "categoryId": 1,
    "sourceId": 1,
    "userId": 1,
    "createdAt": "2024-01-15T12:30:00",
    "updatedAt": "2024-01-15T12:30:00"
  },
  {
    "id": 11,
    "amount": 1200.00,
    "description": "Uber ride",
    "expenseDate": "2024-01-16",
    "categoryId": 2,
    "sourceId": 2,
    "userId": 1,
    "createdAt": "2024-01-16T12:30:00",
    "updatedAt": "2024-01-16T12:30:00"
  }
]
```

#### GET /expenses/summary
**Description:** Get dashboard summary (total expenses, category breakdown, monthly trends)

**Query Parameters:**
- `year` (optional, default: current year): Year for summary
- `month` (optional, default: current month): Month for summary

**Example Request:**
```
GET /api/expenses/summary?year=2024&month=1
```

**Response: 200 OK**
```json
{
  "totalMonth": 5500.00,
  "categoryBreakdown": [
    {
      "categoryId": 1,
      "total": 2500.00,
      "categoryName": "Food & Dining",
      "color": "#FF5722",
      "icon": "restaurant"
    },
    {
      "categoryId": 2,
      "total": 1800.00,
      "categoryName": "Transportation",
      "color": "#2196F3",
      "icon": "directions_car"
    },
    {
      "categoryId": 3,
      "total": 1200.00,
      "categoryName": "Shopping",
      "color": "#9C27B0",
      "icon": "shopping_cart"
    }
  ],
  "monthlyBreakdown": [
    {
      "month": 1,
      "total": 3000.00
    },
    {
      "month": 2,
      "total": 2500.00
    },
    {
      "month": 3,
      "total": 4200.00
    }
  ]
}
```

### 6.3 Category Endpoints

#### GET /categories
**Description:** Retrieve all categories for the user

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "name": "Food & Dining",
    "icon": "restaurant",
    "color": "#FF5722",
    "userId": 1,
    "isDefault": true,
    "createdAt": "2024-01-01T10:00:00"
  },
  {
    "id": 2,
    "name": "Transportation",
    "icon": "directions_car",
    "color": "#2196F3",
    "userId": 1,
    "isDefault": true,
    "createdAt": "2024-01-01T10:00:00"
  }
]
```

#### POST /categories
**Description:** Create a new category

**Request Body:**
```json
{
  "name": "Groceries",
  "icon": "shopping_basket",
  "color": "#4CAF50"
}
```

**Response: 200 OK**
```json
{
  "id": 9,
  "name": "Groceries",
  "icon": "shopping_basket",
  "color": "#4CAF50",
  "userId": 1,
  "isDefault": false,
  "createdAt": "2024-01-20T15:30:00"
}
```

#### PUT /categories/{id}
**Description:** Update a category

**URL Parameter:** `id` - Category ID to update

**Request Body:**
```json
{
  "name": "Groceries Updated",
  "icon": "store",
  "color": "#8BC34A"
}
```

**Response: 200 OK**
```json
{
  "id": 9,
  "name": "Groceries Updated",
  "icon": "store",
  "color": "#8BC34A",
  "userId": 1,
  "isDefault": false,
  "createdAt": "2024-01-20T15:30:00"
}
```

#### DELETE /categories/{id}
**Description:** Delete a category

**URL Parameter:** `id` - Category ID to delete

**Response: 204 No Content**

### 6.4 Expense Source Endpoints

#### GET /sources
**Description:** Retrieve all expense sources

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "name": "Cash",
    "userId": 1,
    "isDefault": true,
    "createdAt": "2024-01-01T10:00:00"
  },
  {
    "id": 2,
    "name": "Credit Card",
    "userId": 1,
    "isDefault": true,
    "createdAt": "2024-01-01T10:00:00"
  }
]
```

#### POST /sources
**Description:** Create a new expense source

**Request Body:**
```json
{
  "name": "PayPal"
}
```

**Response: 200 OK**
```json
{
  "id": 6,
  "name": "PayPal",
  "userId": 1,
  "isDefault": false,
  "createdAt": "2024-01-20T16:00:00"
}
```

#### PUT /sources/{id}
**Description:** Update an expense source

**URL Parameter:** `id` - Source ID to update

**Request Body:**
```json
{
  "name": "PayPal Wallet"
}
```

**Response: 200 OK**
```json
{
  "id": 6,
  "name": "PayPal Wallet",
  "userId": 1,
  "isDefault": false,
  "createdAt": "2024-01-20T16:00:00"
}
```

#### DELETE /sources/{id}
**Description:** Delete an expense source

**URL Parameter:** `id` - Source ID to delete

**Response: 204 No Content**

---

## 7. CSV IMPORT SPECIFICATION

### 7.1 CSV Format Requirements

The application supports importing expenses from CSV files. The file must follow this exact format:

```csv
date,amount,description,category,source
2024-01-15,500,Lunch,Food & Dining,UPI
2024-01-16,1200,Uber ride,Transportation,Credit Card
2024-01-17,50,Movie tickets,Entertainment,Cash
2024-01-18,2000,Groceries,Shopping,Debit Card
2024-01-19,100,Electricity bill,Bills & Utilities,Net Banking
```

### 7.2 Column Specifications

| Column | Type | Required | Format | Example | Notes |
|--------|------|----------|--------|---------|-------|
| date | Date | Yes | YYYY-MM-DD | 2024-01-15 | Expense transaction date |
| amount | Decimal | Yes | Numeric | 500.00 or 500 | Amount spent (supports 2 decimal places) |
| description | String | No | Text | Lunch at restaurant | Transaction description/note |
| category | String | Yes | Text | Food & Dining | Must match existing category name exactly |
| source | String | Yes | Text | Credit Card | Must match existing source name exactly |

### 7.3 Import Workflow

1. **File Selection**: User selects CSV file from Import component
2. **Format Validation**: System validates CSV structure and headers
3. **Content Validation**: System validates each row:
   - Amount is positive decimal
   - Date is valid and in YYYY-MM-DD format
   - Category exists in database
   - Source exists in database
4. **Preview Display**: Shows parsed data with validation status
5. **User Confirmation**: User reviews and confirms import
6. **Bulk Processing**: Data sent to `/expenses/import` endpoint
7. **Database Insert**: Expenses created with current user ID

### 7.4 Validation Rules

- **Amount**: Must be positive (> 0), decimal format with max 2 decimal places
- **Date**: Must be valid date in YYYY-MM-DD format (e.g., 2024-01-15)
- **Category**: Must exactly match existing category name in database
- **Source**: Must exactly match existing source name in database
- **Description**: Optional but recommended for tracking
- **Duplicates**: Duplicate entries are inserted as separate records

### 7.5 Example Import File

```csv
date,amount,description,category,source
2024-01-15,500.00,Restaurant lunch,Food & Dining,Cash
2024-01-15,1200.00,Uber to office,Transportation,Credit Card
2024-01-16,50.00,Movie tickets,Entertainment,Debit Card
2024-01-16,2500.00,Weekly groceries,Shopping,UPI
2024-01-17,100.00,Electricity bill,Bills & Utilities,Net Banking
2024-01-17,200.00,Gym membership,Health,Credit Card
2024-01-18,150.00,Online course,Education,Debit Card
```

---

## 8. FRONTEND COMPONENTS

### 8.1 Frontend Architecture

The frontend is built with Angular 21 using Material Design components and follows a modular, component-based architecture.

### 8.2 Component Structure

```
src/app/
├── app.component.ts
│   └── Root component with navigation shell
│
├── app.module.ts
│   └── Main application module with all imports
│
├── app-routing.module.ts
│   └── Route configuration
│
├── components/
│   ├── layout/
│   │   └── Layout component (navigation, sidenav)
│   │
│   ├── dashboard/
│   │   ├── Dashboard component (analytics view)
│   │   ├── Category breakdown chart
│   │   └── Yearly trend chart
│   │
│   ├── expenses/
│   │   ├── Expenses list component
│   │   ├── Expense table
│   │   ├── Filter options
│   │   ├── Bulk operations
│   │   └── CRUD dialogs
│   │
│   ├── settings/
│   │   ├── Settings component
│   │   ├── Category management
│   │   ├── Source management
│   │   └── Configuration forms
│   │
│   └── import/
│       ├── Import component
│       ├── File upload handler
│       ├── Data preview
│       └── Validation display
│
└── services/
    ├── expense.service.ts
    │   └── Expense API calls
    │
    ├── category.service.ts
    │   └── Category API calls
    │
    └── source.service.ts
        └── Source API calls
```

### 8.3 Key Components Description

**App Component**
- Root component of the application
- Provides navigation shell with sidebar
- Hosts router outlet for component switching

**Layout Component**
- Responsive Material sidenav layout
- Main navigation menu with material icons
- Toolbar with application title
- Adapts to mobile and desktop screens

**Dashboard Component**
- Monthly expense summary
- Doughnut chart for category breakdown
- Bar chart for yearly trend analysis
- Key metrics display (total, average)
- Date range selector for custom periods

**Expenses Component**
- Material data table with expenses list
- Column sorting and pagination
- Filter by category and date range
- CRUD operation buttons
- Bulk select and bulk operations
- Edit/delete dialogs

**Settings Component**
- Category management interface
- Color picker for category customization
- Icon selector from Material icons
- Expense source management
- Add/edit/delete forms with validation

**Import Component**
- CSV file upload with drag-and-drop
- Data preview table
- Validation error display
- Bulk import confirmation
- Success/error notifications

### 8.4 Angular Material Components Used

```typescript
// From app.module.ts
MatToolbarModule           // Header bar
MatSidenavModule           // Navigation sidebar
MatListModule              // List items
MatIconModule              // Material icons
MatButtonModule            // Buttons
MatCardModule              // Card containers
MatTableModule             // Data tables
MatFormFieldModule         // Form fields
MatInputModule             // Text inputs
MatSelectModule            // Dropdown selects
MatDialogModule            // Modal dialogs
MatCheckboxModule          // Checkboxes
NgChartsModule             // Chart integration
```

### 8.5 Frontend Technologies

- **Angular 21.2.0**: Core framework
- **TypeScript 5.9.2**: Type-safe JavaScript
- **Angular Material**: UI component library
- **ng2-charts**: Chart visualization
- **RxJS 7.8.0**: Reactive programming
- **Express.js 5.1.0**: Server-side rendering
- **Vitest 4.0.8**: Unit testing

---

## 9. DEPLOYMENT & SETUP

### 9.1 Prerequisites

Before starting setup, ensure you have:
- **Java 17 or higher** installed: `java -version`
- **Node.js 16+** with npm: `node -v` and `npm -v`
- **MySQL 5.7+** running on your system
- **Python 3.7+** for database setup script
- **Git** for cloning the repository

### 9.2 Complete Database Setup

#### Step 1: Create Environment File

In the project root directory, create `.env`:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=expense_tracker
```

#### Step 2: Install Python Dependencies

```bash
cd database
pip install python-dotenv mysql-connector-python
```

#### Step 3: Run Database Setup Script

```bash
python setup_db.py
```

This script will:
- Connect to MySQL using credentials from `.env`
- Create the database if it doesn't exist
- Execute all SQL commands from `schema.sql`
- Insert default user, categories, and sources

**Output should show:**
```
Database 'expense_tracker' created/verified.
Schema applied successfully.
```

### 9.3 Backend Setup

#### Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.application.name=expense-tracker

# MySQL Configuration (reads from .env via spring-dotenv)
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server Configuration
server.port=8080

# CORS Configuration for frontend
spring.web.cors.allowed-origins=http://localhost:4200
```

#### Running Backend

**Option 1: Using Maven Wrapper**
```bash
cd backend
./mvnw spring-boot:run
```

**Option 2: Using Maven (if installed)**
```bash
cd backend
mvn spring-boot:run
```

**Option 3: Using IDE**
1. Open backend folder in IDE (IntelliJ, Eclipse, VS Code)
2. Navigate to `src/main/java/com/expensetracker/ExpenseTrackerApplication.java`
3. Right-click and select "Run"

**Verification:**
- Backend should start on `http://localhost:8080`
- Check logs for "Started ExpenseTrackerApplication"
- Test endpoint: `curl http://localhost:8080/api/expenses`

### 9.4 Frontend Setup

#### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

#### Step 2: Start Development Server

```bash
ng serve
```

Or use npm script:
```bash
npm start
```

**Verification:**
- Frontend should compile and start on `http://localhost:4200`
- Browser should automatically open to localhost:4200
- Check browser console for any errors

#### Step 3: Access Application

Open browser and navigate to:
```
http://localhost:4200
```

You should see the expense tracker dashboard with default user data.

### 9.5 Production Build

#### Build Backend

```bash
cd backend
./mvnw clean package
```

**Output:**
- JAR file: `backend/target/expense-tracker-1.0.0.jar`
- Run with: `java -jar backend/target/expense-tracker-1.0.0.jar`

#### Build Frontend

```bash
cd frontend
ng build --configuration production
```

**Output:**
- Build artifacts: `frontend/dist/frontend/`
- Static files ready for deployment
- Optimized and minified for production

#### Deploy

1. **Backend**: Deploy JAR to application server
2. **Frontend**: Deploy `dist/` contents to web server (nginx, Apache, etc.)
3. **Configure CORS**: Update allowed origins in production

---

## 10. FEATURES & FUNCTIONALITY

### 10.1 Core Features Checklist

#### 1. Expense Management
- ✅ Create expenses with amount, description, date, category, source
- ✅ View all expenses in paginated tabular format
- ✅ Edit existing expenses with validation
- ✅ Delete individual expenses with confirmation
- ✅ Bulk delete multiple selected expenses
- ✅ Bulk update multiple expenses at once
- ✅ Filter expenses by category
- ✅ Filter expenses by date range
- ✅ Combined filtering (category + date range)
- ✅ Sort by any column

#### 2. Dashboard Analytics
- ✅ Monthly expense summary with total calculation
- ✅ Expense breakdown by category (doughnut chart)
- ✅ Yearly trend analysis (bar chart by month)
- ✅ Month-over-month comparison
- ✅ Category-wise expense visualization with colors
- ✅ Dynamic date range selection
- ✅ Real-time chart updates

#### 3. Category Management
- ✅ View all categories in formatted list
- ✅ Create custom categories
- ✅ Edit category name, icon, color
- ✅ Delete categories (with foreign key constraints)
- ✅ 8 pre-configured default categories
- ✅ Color picker for custom colors
- ✅ Material icon selector

#### 4. Expense Source Management
- ✅ View all payment sources
- ✅ Create new payment sources
- ✅ Edit source name
- ✅ Delete sources
- ✅ 5 pre-configured default sources
- ✅ Dropdown integration in expense form

#### 5. CSV Import
- ✅ Upload CSV files from computer
- ✅ Validate CSV format and structure
- ✅ Preview imported data before processing
- ✅ Show validation errors and warnings
- ✅ Bulk import expenses with single action
- ✅ Error handling with user feedback
- ✅ Success notifications after import

### 10.2 User Interface Features

- **Material Design UI**: Clean, modern interface following Material Design guidelines
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Navigation Sidenav**: Easy access to all application features
- **Data Tables**: Material tables with sorting and pagination
- **Charts**: Interactive visualizations (doughnut, bar charts)
- **Forms**: Input validation with error messages
- **Dialogs**: Confirmation dialogs for critical operations
- **Notifications**: Toast/snackbar messages for user feedback
- **Icons**: Material icons throughout the interface
- **Color Scheme**: Material indigo-pink theme
- **Accessibility**: ARIA labels and keyboard navigation support

---

## 11. TECHNICAL CONSIDERATIONS

### 11.1 Authentication & Authorization

**Current State:**
- Authentication is disabled for development
- Default user ID = 1 is hardcoded in all endpoints
- All requests treated as default user

**Future Implementation:**
- Firebase Authentication ready (firebaseUid field in User model)
- OAuth2/JWT token-based authentication
- Session management
- Role-based access control (RBAC)
- Multi-user support

### 11.2 Performance Optimization

- **Eager Loading**: Category and ExpenseSource entities eagerly loaded
- **Indexed Queries**: Database queries optimized for speed
- **Pagination**: Material table supports data pagination
- **CORS Configuration**: Enabled only for localhost:4200
- **Angular Optimization**: Production builds minified and bundled
- **Caching Strategies**: Material cache for HTTP responses

### 11.3 Data Validation

**Frontend Validation:**
- Required field validation
- Date format validation
- Amount decimal validation
- File type validation for CSV

**Backend Validation:**
- Server-side re-validation of all inputs
- Database constraint validation (NOT NULL, UNIQUE, FOREIGN KEY)
- Date validation in ISO format
- Amount validation (positive decimal)
- Category and source existence checks

### 11.4 Error Handling

**HTTP Error Responses:**
- 400: Bad Request (validation errors)
- 404: Resource Not Found
- 500: Internal Server Error
- 204: No Content (successful delete)

**Database Error Handling:**
- Transaction rollback on bulk operations
- Graceful handling of missing resources
- Referential integrity constraints

**Frontend Error Handling:**
- Try-catch blocks for API calls
- Error notifications to user
- Fallback UI states
- Console logging for debugging

### 11.5 Security Considerations

**Implemented:**
- Password hash field available (not currently used)
- CORS configured for frontend domain only
- HTTP-only endpoints (no sensitive data in URLs)
- Database credentials externalized via .env file
- Input sanitization at database level

**Recommendations:**
- Implement HTTPS/SSL in production
- Use environment-specific configurations
- Implement rate limiting
- Add request logging and monitoring
- Implement audit trails for sensitive operations
- Use prepared statements (already done via JPA)

### 11.6 Scalability Considerations

- **Database**: MySQL supports large datasets with proper indexing
- **API**: Spring Boot handles concurrent requests efficiently
- **Frontend**: Angular supports lazy loading and code splitting
- **Caching**: Implement Redis for session and query caching
- **CDN**: Deploy static assets to CDN in production
- **Microservices**: Architecture ready for service decomposition

---

## 12. CONFIGURATION FILES

### 12.1 Backend POM.xml Dependencies

```xml
<!-- Spring Boot Starter Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Lombok - Reduces Boilerplate Code -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Spring Boot Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Spring Dotenv - Environment Variables -->
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

### 12.2 Frontend package.json Dependencies

```json
{
  "dependencies": {
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/material": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/platform-browser-dynamic": "^21.2.0",
    "@angular/router": "^21.2.0",
    "@angular/ssr": "^21.2.15",
    "express": "^5.1.0",
    "ng2-charts": "^4.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^21.2.15",
    "@angular/build": "^21.2.15",
    "@angular/cli": "^21.2.15",
    "@angular/compiler-cli": "^21.2.0",
    "@types/express": "^5.0.1",
    "@types/node": "^20.17.19",
    "jsdom": "^28.0.0",
    "prettier": "^3.8.1",
    "typescript": "~5.9.2",
    "vitest": "^4.0.8"
  }
}
```

### 12.3 Application Properties

```properties
# Application Name
spring.application.name=expense-tracker

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server Port
server.port=8080

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:4200
```

---

## 13. QUICK START GUIDE

### 5-Minute Setup (Assuming prerequisites installed)

#### Step 1: Clone Repository
```bash
git clone https://github.com/ShashankK-23/Capstone_CAIT.git
cd Capstone_CAIT
```

#### Step 2: Setup Environment
```bash
# Create .env file with MySQL credentials
echo "DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker" > .env
```

#### Step 3: Initialize Database
```bash
cd database
pip install python-dotenv mysql-connector-python
python setup_db.py
cd ..
```

#### Step 4: Start Backend
```bash
cd backend
./mvnw spring-boot:run &
# Wait for "Started ExpenseTrackerApplication" message
cd ..
```

#### Step 5: Start Frontend
```bash
cd frontend
npm install
ng serve
# Opens automatically at http://localhost:4200
```

#### Step 6: Verify Installation
- Open browser to `http://localhost:4200`
- Check dashboard loads correctly
- Try creating a test expense

**Success!** Application is now running locally.

---

## 14. PROJECT STRUCTURE SUMMARY

```
Capstone_CAIT/
│
├── backend/
│   ├── src/main/java/com/expensetracker/
│   │   ├── ExpenseTrackerApplication.java
│   │   ├── controller/
│   │   │   ├── ExpenseController.java
│   │   │   ├── CategoryController.java
│   │   │   └── ExpenseSourceController.java
│   │   ├── service/
│   │   │   └── ExpenseService.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Expense.java
│   │   │   ├── Category.java
│   │   │   └── ExpenseSource.java
│   │   ├── repository/
│   │   │   ├── ExpenseRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   └── ExpenseSourceRepository.java
│   │   └── config/
│   │       └── DotenvConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── mvnw/mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app-routing.module.ts
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── expenses/
│   │   │   │   ├── settings/
│   │   │   │   └── import/
│   │   │   └── services/
│   │   │       ├── expense.service.ts
│   │   │       ├── category.service.ts
│   │   │       └── source.service.ts
│   │   ├── environments/
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.scss
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── karma.conf.js
│
├── database/
│   ├── schema.sql
│   ├── setup_db.py
│   └── README.md
│
├── .env
├── .env.example
├── .gitignore
├── README.md
└── COMPLETE_PROJECT_DOCUMENTATION.md
```

---

## 15. API TESTING WITH CURL EXAMPLES

### Testing Expenses Endpoint

#### Create New Expense
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500.00,
    "description": "Lunch at restaurant",
    "expenseDate": "2024-01-15",
    "categoryId": 1,
    "sourceId": 1
  }'
```

#### Get All Expenses
```bash
curl -X GET http://localhost:8080/api/expenses
```

#### Get Filtered Expenses
```bash
curl -X GET "http://localhost:8080/api/expenses?categoryId=1&startDate=2024-01-01&endDate=2024-01-31"
```

#### Get Dashboard Summary
```bash
curl -X GET "http://localhost:8080/api/expenses/summary?year=2024&month=1"
```

#### Update Expense
```bash
curl -X PUT http://localhost:8080/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 600.00,
    "description": "Updated lunch"
  }'
```

#### Delete Single Expense
```bash
curl -X DELETE http://localhost:8080/api/expenses/1
```

#### Bulk Delete Expenses
```bash
curl -X POST http://localhost:8080/api/expenses/bulk-delete \
  -H "Content-Type: application/json" \
  -d '[1, 2, 3]'
```

#### Bulk Update Expenses
```bash
curl -X PUT http://localhost:8080/api/expenses/bulk-update \
  -H "Content-Type: application/json" \
  -d '[
    {"id": 1, "amount": 600.00},
    {"id": 2, "description": "Updated description"}
  ]'
```

### Testing Categories Endpoint

#### Get All Categories
```bash
curl -X GET http://localhost:8080/api/categories
```

#### Create Category
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Groceries",
    "icon": "shopping_basket",
    "color": "#4CAF50"
  }'
```

#### Update Category
```bash
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food",
    "icon": "restaurant",
    "color": "#FF5722"
  }'
```

#### Delete Category
```bash
curl -X DELETE http://localhost:8080/api/categories/1
```

### Testing Sources Endpoint

#### Get All Sources
```bash
curl -X GET http://localhost:8080/api/sources
```

#### Create Source
```bash
curl -X POST http://localhost:8080/api/sources \
  -H "Content-Type: application/json" \
  -d '{"name": "PayPal"}'
```

#### Update Source
```bash
curl -X PUT http://localhost:8080/api/sources/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "PayPal Wallet"}'
```

#### Delete Source
```bash
curl -X DELETE http://localhost:8080/api/sources/1
```

---

## 16. TROUBLESHOOTING

### Database Connection Issues

**Problem:** "Connection refused" or "Cannot connect to MySQL"

**Solutions:**
1. Verify MySQL is running:
   - Windows: Check Services for MySQL
   - Mac: `brew services list | grep mysql`
   - Linux: `sudo systemctl status mysql`

2. Check credentials in `.env` file:
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=correct_password
   ```

3. Verify database exists:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

4. Re-run setup script:
   ```bash
   cd database
   python setup_db.py
   ```

### Backend Startup Issues

**Problem:** "Failed to start application" or port already in use

**Solutions:**
1. Check Java version:
   ```bash
   java -version  # Should be 17 or higher
   ```

2. Check port availability:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Mac/Linux
   lsof -i :8080
   ```

3. Kill process on port 8080:
   ```bash
   # Mac/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

4. Clear Maven cache:
   ```bash
   cd backend
   ./mvnw clean
   ./mvnw spring-boot:run
   ```

### Frontend Cannot Connect to Backend

**Problem:** "Failed to fetch" or CORS errors

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:8080/api/expenses
   ```

2. Check CORS configuration in `application.properties`:
   ```properties
   spring.web.cors.allowed-origins=http://localhost:4200
   ```

3. Check browser console for specific errors (F12)

4. Clear browser cache and restart:
   ```bash
   cd frontend
   ng serve
   ```

### CSV Import Issues

**Problem:** "CSV validation failed" or "Category not found"

**Solutions:**
1. Verify CSV format:
   - First row must be: `date,amount,description,category,source`
   - Dates in YYYY-MM-DD format
   - Category and source names must match exactly

2. Check database has categories and sources:
   ```bash
   mysql> SELECT * FROM categories;
   mysql> SELECT * FROM expense_sources;
   ```

3. Add missing categories if needed through Settings UI

4. Test with sample CSV:
   ```csv
   date,amount,description,category,source
   2024-01-15,500,Test,Food & Dining,Cash
   ```

### Performance Issues

**Problem:** Application is slow

**Solutions:**
1. Check network requests in browser DevTools (F12 → Network tab)
2. Verify database indices are created
3. Restart backend to clear memory
4. Check available disk space
5. Monitor system resources (RAM, CPU)

---

## 17. FUTURE ENHANCEMENTS

### Phase 1: Authentication & Security
- [ ] Implement Firebase authentication
- [ ] Add user registration and login pages
- [ ] Implement JWT token-based security
- [ ] Add password reset functionality
- [ ] Implement role-based access control

### Phase 2: Advanced Analytics
- [ ] Monthly budget tracking and alerts
- [ ] Recurring expense management
- [ ] Expense trend analysis and predictions
- [ ] Budget threshold notifications
- [ ] Expense forecasting based on historical data

### Phase 3: Mobile Application
- [ ] React Native mobile app
- [ ] Flutter mobile app (alternative)
- [ ] Offline synchronization support
- [ ] Mobile-specific UI/UX

### Phase 4: Reporting & Export
- [ ] PDF expense report generation
- [ ] Email summary reports
- [ ] Excel export functionality
- [ ] Scheduled report delivery
- [ ] Custom report builder

### Phase 5: Collaboration Features
- [ ] Multi-user support
- [ ] Shared budget management
- [ ] Expense splitting between users
- [ ] Team collaboration features
- [ ] Permission management

### Phase 6: Notifications & Reminders
- [ ] Email reminders for recurring expenses
- [ ] Budget threshold alerts
- [ ] Recurring expense notifications
- [ ] SMS notifications (premium feature)
- [ ] Push notifications for mobile app

### Phase 7: Advanced Integration
- [ ] Bank account integration
- [ ] Credit card API integration
- [ ] Tax calculation assistance
- [ ] Third-party payment gateway integration
- [ ] API for third-party applications

### Phase 8: Performance & Scalability
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] Microservices architecture
- [ ] GraphQL API option
- [ ] Real-time updates with WebSockets

---

## Document Information

| Property | Value |
|----------|-------|
| Generated | June 15, 2026 |
| Project | Capstone CAIT - Expense Tracker |
| Repository | https://github.com/ShashankK-23/Capstone_CAIT |
| Language Composition | TypeScript 64.4%, Java 29.3%, Python 2.8%, JavaScript 2.3%, HTML 0.8% |
| Version | 1.0.0 |
| Status | Active Development |

---

**End of Complete Project Documentation**
