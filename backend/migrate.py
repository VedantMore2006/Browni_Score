# backend/migrate.py — run once before using new API
# Adds project_id and project_lead_name columns to tasks table

import sqlite3

conn = sqlite3.connect("vitals_vectors.db")
cursor = conn.cursor()

# Add project_id column if not exists
try:
    cursor.execute("ALTER TABLE tasks ADD COLUMN project_id TEXT")
    print("Added project_id column")
except Exception as e:
    print(f"project_id: {e}")

# Add project_lead_name column if not exists
try:
    cursor.execute("ALTER TABLE tasks ADD COLUMN project_lead_name TEXT")
    print("Added project_lead_name column")
except Exception as e:
    print(f"project_lead_name: {e}")

conn.commit()
conn.close()
print("Migration complete")
