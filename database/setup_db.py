"""
One-time database setup script.
Loads credentials from ../.env file.
Install dependency: pip install python-dotenv mysql-connector-python
"""
import mysql.connector
import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
}

DB_NAME = os.getenv('DB_NAME', 'expense_tracker')

def create_database():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cursor.close()
    conn.close()
    print(f"Database '{DB_NAME}' created/verified.")

def run_schema():
    config = {**DB_CONFIG, 'database': DB_NAME}
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        sql = f.read()

    statements = [s.strip() for s in sql.split(';') if s.strip()]
    for stmt in statements:
        if stmt.upper().startswith('CREATE DATABASE') or stmt.upper().startswith('USE '):
            continue
        try:
            cursor.execute(stmt)
        except mysql.connector.Error as e:
            if e.errno == 1062:
                print(f"Skipping (already exists): {stmt[:50]}...")
            else:
                print(f"Error: {e}\nStatement: {stmt[:80]}...")

    conn.commit()
    cursor.close()
    conn.close()
    print("Schema applied successfully.")

if __name__ == '__main__':
    create_database()
    run_schema()