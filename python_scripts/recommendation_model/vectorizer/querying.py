import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize

def get_query_embedding(query, word2int, embedding_matrix):
    words = query.lower().split()

    stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

    results = []
    for word in words:    
        if word not in stop_words:
            word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'s","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","")
            if word.isalpha():
                results.append(word.lower())
    print(" ".join(results))
        
    # results.append(" ".join(results))

    indices = [word2int.get(word, 1) for word in words if word2int.get(word, 1) != 0]

    if not indices:
        print("No valid words in query")
        return None
    
    word_embeddings = embedding_matrix[indices]

    query_embedding = np.mean(word_embeddings, axis=0)
    return query_embedding

def find_similar_articles(query_embedding, doc_embeddings, top_k=10):
    similarities = cosine_similarity(query_embedding, doc_embeddings)[0]
   
    top_articles = similarities.argsort()[-top_k:][::-1]

    return [(idx, similarities[idx]) for idx in top_articles]

with open('word2int.json', 'r') as f:
    word2int = json.load(f)

embedding_matrix = np.load('embedding_matrix.npy')
doc_embeddings = np.load('doc_embeddings.npy')
normalized_doc_embeds = normalize(doc_embeddings)

query = "Cybersecurity and AI governance and children's privacy"
query_vec = get_query_embedding(query, word2int, embedding_matrix)
normalized_query_embed = normalize(query_vec.reshape(1, -1))

with open('word2int.json', 'r') as f:
    doc_ids = json.load(f)

if query_vec is not None:
    results = find_similar_articles(normalized_query_embed, normalized_doc_embeds, top_k=10)
    for doc_id, score in results:
        article_id = doc_ids[str(doc_id)]
        print(f"Doc {article_id} with similarity {score}")

