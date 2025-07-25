

# https://ai.google.dev/gemini-api/docs#python

import psycopg2
import os
from dotenv import load_dotenv
from google import genai


load_dotenv()

def connect_to_db():

    host = os.getenv("PGHOST")
    conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

    conn = psycopg2.connect(conn_string)

    cursor = conn.cursor()

    return conn, cursor

def generate_summaries():

    client = genai.Client()

    conn, cursor = connect_to_db()

    cursor.execute('SELECT content, id FROM "Article"')

    rows = cursor.fetchall()

    for row in rows[0:1]:
        content, id = row

        response = client.models.generate_content(
            model="models/gemini-2.5-flash-lite",
            contents=f"Summarize the following privacy news article fit for a short description: {content}",
        )

        print(response.text)
    
generate_summaries()