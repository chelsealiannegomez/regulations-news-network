import psycopg2
import numpy as np
import json
import os
from dotenv import load_dotenv

# This script is was written just to check the contents of the "embeddings" table, since I am not using Prisma as an ORM (for this table)

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

cursor.execute("SELECT * FROM embeddings;")

contents = cursor.fetchall()

for i in contents:
    print(i)