import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

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

def demonstrate_search(query):

    response = requests.get('http://localhost:3000/api/articles')
    articles = response.json()["articles"]

    search_engine = VectorSearch()
    search_engine.add_documents(articles)

    print(f"\n Searching for: '{query}'")

    results = search_engine.search(query, top_k = len(search_engine.documents))

    result_indexes = []

    for result in results:
        result_indexes.append(result["index"])

    return result_indexes
