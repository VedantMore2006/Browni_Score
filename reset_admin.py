import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hash_pw = pwd_context.hash("hunter123")

conn = sqlite3.connect('backend/vitals_vectors.db')
cursor = conn.cursor()
cursor.execute("UPDATE members SET password_hash = ? WHERE username = 'admin'", (hash_pw,))
conn.commit()
conn.close()
print("Admin password reset to hunter123")
