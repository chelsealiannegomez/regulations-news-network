import requests
import math
import json
import numpy as np

from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))


def get_articles():
    response = requests.get('https://regulations-news-network.vercel.app/api/articles')
    articles = response.json()["articles"]

    documents = [article['content'] for article in articles]

    doc_ids = {i: articles[i]['id'] for i in range(math.floor(len(articles) * 0.8))}

    with open("doc_ids.json", "w") as json_file:
        json.dump(doc_ids, json_file, indent=4)

    return doc_ids, documents

# Normalize text

def remove_stop_words(documents):
    results = []
    for text in documents:
        # Text is an array of paragraphs
        temp = []
        for paragraph in text:
            paragraph = paragraph.replace("Editor's note: The IAPP is policy neutral. We publish contributed opinion and analysis pieces to enable our members to hear a broad spectrum of views in our domains.", "")
            words = paragraph.split(" ")
            
            for word in words:
                if word not in stop_words:
                    word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","").replace("'s","")
                    if word.isalpha():
                        temp.append(word.lower())
        
        results.append(" ".join(temp))

    if len(results) > 500:

        doc_contents = {i: results[i] for i in range(len(results))}

        with open("doc_contents.json", "w") as json_file:
            json.dump(doc_contents, json_file, indent=4)

    return results

def replace_rare_words(corpus, min_freq=5):
    # Count word frequencies
    word_freq = {}
    for doc in corpus:
        for word in doc.split():
            word_freq[word] = word_freq.get(word, 0) + 1

    # Build fixed vocab with frequent words only
    word2int = {"<PAD>": 0, "<UNK>": 1}
    index = 2
    for word, freq in word_freq.items():
        if freq >= min_freq:
            word2int[word] = index
            index += 1

    # Convert corpus to indices, replacing rare words with <UNK>
    data = []
    for doc in corpus:
        word_indices = []
        for word in doc.split():
            if word in word2int:
                word_indices.append(word2int[word])
            else:
                word_indices.append(word2int["<UNK>"])
        data.append(word_indices)

    return data, word2int

def get_data():
    doc_ids, articles = get_articles()

    documents = articles[0: math.floor(len(articles) * 0.8)]

    # Corpus: documents without stop words
    corpus = remove_stop_words(documents)
    print("corpus", len(corpus))

    data, word2int = replace_rare_words(corpus)

    with open("word2int.json", "w") as json_file:
        json.dump(word2int, json_file, indent=4)

    vocab_size = len(word2int)

    eval_documents = articles[math.floor(len(articles) * 0.8) :]
    eval_corpus = remove_stop_words(eval_documents)

    eval_data = []
    for index, content in enumerate(eval_corpus):
        temp = []
        for word in content.split():
            if word not in word2int:
                temp.append(1)
            else:
                temp.append(word2int[word])
        eval_data.append(temp)

    return data, eval_data, word2int

get_data()