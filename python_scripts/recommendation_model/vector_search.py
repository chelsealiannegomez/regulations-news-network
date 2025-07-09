import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from functools import lru_cache
import math
import os 
from dotenv import load_dotenv

load_dotenv()

class VectorSearch:
    def __init__(self):
        self.documents = []
        self.vectors = None
        self.vectorizer = TfidfVectorizer (
            stop_words = 'english',
            lowercase = True,
            max_features = 1000
        )

    def add_documents(self, docs):
        self.documents.extend(docs)
        texts = [doc["content"] for doc in self.documents]
        self.vectors = self.vectorizer.fit_transform(texts)
        print(f"Added {len(docs)} documents. Total: {len(self.documents)}")
        print(f"Vector shape: {self.vectors.shape}")

    def search(self, query, top_k=5):
        if self.vectors is None:
            return []
        
        query_vector = self.vectorizer.transform([query])

        similarities = cosine_similarity(query_vector, self.vectors)[0]

        top_indices = similarities.argsort()[-top_k:][::-1]

        results = []
        for idx in top_indices:
            results.append({
                'document': self.documents[idx],
                'similarity': similarities[idx],
                'index': self.documents[idx]["id"]
            })

        return results

@lru_cache(maxsize=1)
def demonstrate_search(query):
    response = requests.get(f'{os.getenv('FASTAPI_DOMAIN')}/api/articles')
    print(response)
    articles = response.json()["articles"]

    search_engine = VectorSearch()
    search_engine.add_documents(articles)

    print(f"\n Searching for: '{query}'")

    results = search_engine.search(query, top_k = len(search_engine.documents))

    ordered_articles = []

    for result in results:
        ordered_articles.append(result["document"])

    return ordered_articles, len(articles)

def articles_per_page(page_num, num_articles_per_page, query):
    ordered_articles, total_num_articles = demonstrate_search(query)

    first_id, last_id = -1, -1

    max_page_num = math.ceil(total_num_articles / num_articles_per_page)

    if page_num > max_page_num or page_num < 1:
        return "Page invalid"

    if page_num * num_articles_per_page > total_num_articles:
        first_id =  (page_num - 1) * num_articles_per_page  + 1
        last_id = total_num_articles 

    else:
        first_id = (page_num - 1) * num_articles_per_page + 1
        last_id = page_num * num_articles_per_page

    return ordered_articles[first_id - 1: last_id], len(ordered_articles)

