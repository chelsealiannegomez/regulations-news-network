import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
import tensorflow as tf
import psycopg2
import numpy as np
import json
import os
from dotenv import load_dotenv
from create_model import ReduceMeanLayer
from datetime import date

from stop_words import stop_words 

load_dotenv()

def get_word2int():
    with open('word2int.json', 'r') as f:
        word2int = json.load(f)
    return word2int


def connect_to_db():
    host = os.getenv("PGHOST")
    conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

    conn = psycopg2.connect(conn_string)

    cursor = conn.cursor()

    return conn, cursor

def get_query_embedding(query, word2int, embedding_matrix):
    cleaned_query = []
    for word in query:    
        if word not in stop_words:
            word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'s","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","")
            if word.isalpha():
                cleaned_query.append(word.lower())

    indices = [word2int.get(word, 1) for word in query if word2int.get(word, 1) != 0]

    if not indices:
        print("No valid words in query")
        return None
    
    word_embeddings = embedding_matrix[indices]

    query_embedding = np.mean(word_embeddings, axis=0)

    normalized_query_embed = normalize(query_embedding.reshape(1, -1))

    return normalized_query_embed.squeeze()

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def recency_weight(days_old, decay_rate=0.1): # Exponential decay weight
    return 2.71828 ** (-decay_rate * days_old)


def get_ordered_articles(query, user_locations_string):
    conn, cursor = connect_to_db()
    
    word2int = get_word2int()

    model = tf.keras.models.load_model('doc2vec_model.keras', custom_objects={'ReduceMeanLayer': ReduceMeanLayer})
    word_embedding_layer = model.get_layer("reduce_mean_context")

    trained_embedding_matrix = word_embedding_layer.embedding.get_weights()[0]

    query_vector = get_query_embedding(query, word2int, trained_embedding_matrix)

    cursor.execute('SELECT date_posted, location, article_id, vector FROM "Article" INNER JOIN embeddings ON "Article".id = embeddings.article_id;')
    articles = cursor.fetchall()
    print(len(articles))
    # Rows of tuples: primary id, article id, vector

    weighted_articles = []

    for article in articles:
        date_posted, location_string, article_id, vector_string = article
        vector = np.array(eval(vector_string), dtype=np.float32)

        # cursor.execute('SELECT date_posted, location FROM "Article" WHERE id=%s', (article_id,))
        # row = cursor.fetchone() # Tuple: primary id, url, date_posted, location, description, content, keywords

        # date_posted, location_string = row
        
        locations = location_string.split(',')
        user_locations_unstripped = user_locations_string.split(',')
        user_locations = {loc.strip() for loc in user_locations_unstripped}
        found_location  = any(x in user_locations for x in locations)
        if not found_location:
            continue # Location of article is not wanted by user, skip

        today = date.today()

        days_diff = (today - date_posted).days
        
        date_weight = recency_weight(days_diff)

        similarity = cosine_similarity(vector, query_vector)
        final_score = similarity * 0.8 + date_weight * 0.2
        weighted_articles.append([article_id, final_score])

    sorted_articles = sorted(weighted_articles, key=lambda x: x[1], reverse=True)

    for i in sorted_articles[0:20]:
        print(i)

    return [i[0] for i in sorted_articles]