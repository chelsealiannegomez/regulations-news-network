import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

try:
    host = os.getenv("PGHOST")
    conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

    conn = psycopg2.connect(conn_string)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE EXTENSION IF NOT EXISTS vector;
        
        CREATE TABLE IF NOT EXISTS embeddings (
            id SERIAL PRIMARY KEY,
            article_id INTEGER NOT NULL,
            vector VECTOR(100) NOT NULL
        );
    """)
    conn.commit()

except Exception as e:
    print("Error:", e)