import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize

def get_query_embedding(query, word2int, embedding_matrix):
    indices = [word2int.get(word, 1) for word in query if word2int.get(word, 1) != 0]

    if not indices:
        print("No valid words in query")
        return None
    
    word_embeddings = embedding_matrix[indices]

    query_embedding = np.mean(word_embeddings, axis=0)
    return query_embedding


with open('doc_contents.json', 'r') as f:
    doc_contents = json.load(f)

def compute_tf(doc_id, query):

    contents = doc_contents[str(doc_id)]

    count = 0

    total_count = 0


    for word in contents.split(" "):
        if word in query:
            count += 1
        total_count += 1

    return float(count)


def find_similar_articles(query, query_embedding, doc_embeddings, top_k=10):
    similarities = cosine_similarity(query_embedding, doc_embeddings)[0]

    scores = []

    max_count = 0

    for doc_id, score in enumerate(similarities):
        count = compute_tf(doc_id, query)
        if count > max_count:
            max_count = count
        scores.append([count, score])


    weighted_score = [scores[i][0]/float(max_count) * 0.25 + scores[i][1] * 0.75 for i in range(len(scores))]

    weighted_score = np.array(weighted_score)
   
    top_articles = weighted_score.argsort()[-top_k:][::-1]

    with open('doc_ids.json', 'r') as f:
        doc_ids = json.load(f)

    actual_top_articles = [(doc_ids[str(idx)], weighted_score[idx]) for idx in top_articles]

    return actual_top_articles

def get_recommended_articles(query):

    with open('word2int.json', 'r') as f:
        word2int = json.load(f)

    embedding_matrix = np.load('embedding_matrix.npy')
    doc_embeddings = np.load('doc_embeddings.npy')
    normalized_doc_embeds = normalize(doc_embeddings)

    words = query.lower().split()

    stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

    cleaned_query = []
    for word in words:    
        if word not in stop_words:
            word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'s","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","")
            if word.isalpha():
                cleaned_query.append(word.lower())

    query_vec = get_query_embedding(cleaned_query, word2int, embedding_matrix)
    normalized_query_embed = normalize(query_vec.reshape(1, -1))

    if query_vec is not None:
        results = find_similar_articles(cleaned_query, normalized_query_embed, normalized_doc_embeds, top_k=10)
        for doc_id, score in results:
            print(f"Doc {doc_id} with similarity {score}")
    return results


query = "Cybersecurity and AI governance and children's privacy"
get_recommended_articles(query)