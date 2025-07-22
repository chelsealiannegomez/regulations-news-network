import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from functools import lru_cache
import math
from datetime import datetime, date

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
        texts = [" ".join(doc["content"]) for doc in self.documents]
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
def get_articles():
    response = requests.get('https://regulations-news-network.vercel.app/api/articles')
    return response

@lru_cache(maxsize=1)
def demonstrate_search(query, locations):
    split_locations = list(locations.strip().split(" "))
    preferred_locations = [loc.replace("_", " ") for loc in split_locations]
    preferred_locations.append("")

    response = get_articles()
    articles = response.json()["articles"]

    filtered_articles = list(filter(lambda article: any(loc in preferred_locations for loc in article['location'].split(", ")), articles))
    
    search_engine = VectorSearch()
    search_engine.add_documents(filtered_articles)

    print(f"\n Searching for: '{query}'")

    results = search_engine.search(query, top_k = len(search_engine.documents))

    curr_dt = int(datetime.now().timestamp())

    ordered_articles = []
    weighted_articles = []

    for result in results:
        ordered_articles.append(result["document"])
        dt_str = result['document']['date_posted']
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        print("title and similarity score", result['document']['title'], result['similarity'])

        article_dt = int(dt.timestamp())
        date_weight = float(1) / (curr_dt - article_dt)
        total_weight = result['similarity'] * 0.7 + date_weight * 0.3
        weighted_articles.append((result["document"], total_weight))

    sorted_weighted_articles = sorted(weighted_articles, key=lambda pair: pair[1], reverse=True)
    
    for i in sorted_weighted_articles:
        print("final date posted", i[0]['title'], i[0]['date_posted'], i[1])
    


    return [i[0] for i in sorted_weighted_articles], len(sorted_weighted_articles)

def articles_per_page(page_num, num_articles_per_page, query, locations):

    ordered_articles, total_num_articles = demonstrate_search(query, locations)

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

def articles_per_page_by_date(page_num, num_articles_per_page, locations):

    split_locations = list(locations.strip().split(" "))
    preferred_locations = [loc.replace("_", " ") for loc in split_locations]
    preferred_locations.append("")

    response = get_articles()
    articles = response.json()["articles"]

    filtered_articles = list(filter(lambda article: any(loc in preferred_locations for loc in article['location'].split(", ")), articles))

    sorted_articles = sorted(filtered_articles, key=lambda obj: obj['date_posted'], reverse=True)

    ordered_articles, total_num_articles = sorted_articles, len(sorted_articles)

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
