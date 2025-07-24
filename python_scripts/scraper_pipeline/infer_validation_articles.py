import psycopg2
import numpy as np
import os
from dotenv import load_dotenv
from infer_article_embedding import infer_article

load_dotenv()

def connect_to_db():
    try: 

        host = os.getenv("PGHOST")
        conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

        conn = psycopg2.connect(conn_string)

        cursor = conn.cursor()

        return conn, cursor
    
    except Exception as e:
        print("Error:", e)

def save_embeddings():

    conn, cursor = connect_to_db()
    try: 
        cursor.execute('SELECT id, content FROM "Article"')
        rows = cursor.fetchall()

    except Exception as e:
        print("Error:", e)


    for row in rows:
        cursor.execute('SELECT 1 FROM embeddings where article_id=%s;', (row[0],))
        exists = cursor.fetchone()
        print("checking article", row[0])

        if not exists:
            article_vector = infer_article(" ".join(row[1]), row[0])
            query = 'INSERT INTO embeddings (article_id, vector) VALUES (%s, %s)'
            values = (str(row[0]), article_vector.tolist())
            print("Inserted into DB")

            cursor.execute(query, values)
            conn.commit()

save_embeddings()