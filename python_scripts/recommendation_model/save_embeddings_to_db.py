import psycopg2
import numpy as np
import json
import os
from dotenv import load_dotenv

load_dotenv()

def get_doc_ids():
    with open('doc_ids.json', 'r') as f:
        doc_ids = json.load(f)

    return doc_ids

def connect_to_db():

    host = os.getenv("PGHOST")
    conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

    conn = psycopg2.connect(conn_string)

    cursor = conn.cursor()

    return conn, cursor

def save_embeddings():
    doc_embeddings = np.load('doc_embeddings.npy')

    doc_ids = get_doc_ids()
    conn, cursor = connect_to_db()
    for idx in range(len(doc_embeddings)):
        cursor.execute("""
        INSERT INTO embeddings (article_id, vector)
        VALUES (%s, %s);
        """, (doc_ids[str(idx)], doc_embeddings[idx].tolist()))

        conn.commit()
        print(f"Article {doc_ids[str(idx)]} added to db")
