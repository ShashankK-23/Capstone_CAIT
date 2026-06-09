-- Expense Tracker Database Schema
-- Run this script once to create all required tables

CREATE DATABASE IF NOT EXISTS cait_capestone;
USE cait_capestone;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    user_id BIGINT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expense_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
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

-- Insert a default user (auth disabled for now)
INSERT INTO users (id, email, username, password_hash) VALUES (1, 'default@example.com', 'Default User', 'disabled');

-- Insert default categories for user 1
INSERT INTO categories (name, icon, color, user_id, is_default) VALUES
('Food & Dining', 'restaurant', '#FF5722', 1, TRUE),
('Transportation', 'directions_car', '#2196F3', 1, TRUE),
('Shopping', 'shopping_cart', '#9C27B0', 1, TRUE),
('Entertainment', 'movie', '#FF9800', 1, TRUE),
('Bills & Utilities', 'receipt_long', '#607D8B', 1, TRUE),
('Health', 'local_hospital', '#4CAF50', 1, TRUE),
('Education', 'school', '#3F51B5', 1, TRUE),
('Others', 'more_horiz', '#795548', 1, TRUE);

-- Insert default expense sources for user 1
INSERT INTO expense_sources (name, user_id, is_default) VALUES
('Cash', 1, TRUE),
('Credit Card', 1, TRUE),
('Debit Card', 1, TRUE),
('UPI', 1, TRUE),
('Net Banking', 1, TRUE);
