import psycopg2
from dotenv import load_dotenv
import os
import json

load_dotenv()

def insert_json_to_db(content):
    try:
        host = os.getenv("PGHOST")
        conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

        conn = psycopg2.connect(conn_string)

        cursor = conn.cursor()

        for article in content:
            query = 'INSERT INTO "Article" (url, title, date_posted, location, description, content, keywords) VALUES (%s, %s, %s, %s, %s, %s, %s)'
            values = (article.url, article.title, article.date_published, article.location, article.description, article.content, article.keywords)
            cursor.execute(query, values)

        print("Successfully added articles to database")

        cursor.close()
        conn.close()

    except Exception as e:
        print("Error connecting to database:", e)
  