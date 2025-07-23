import psycopg2
import numpy as np
import json
import os
from dotenv import load_dotenv

load_dotenv()

doc_embeddings = np.load('doc_embeddings.npy')

def get_doc_ids():
    with open('doc_ids.json', 'r') as f:
        doc_ids = json.load(f)

    return doc_ids

doc_ids = get_doc_ids()

host = os.getenv("PGHOST")
conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

conn = psycopg2.connect(conn_string)

cursor = conn.cursor()


for idx in range(len(doc_embeddings)):
    cursor.execute("""
    INSERT INTO embeddings (article_id, vector)
    VALUES (%s, %s);
    """, (doc_ids[str(idx)], doc_embeddings[idx].tolist()))

    conn.commit()
    print(f"Article {doc_ids[str(idx)]} added to db")
