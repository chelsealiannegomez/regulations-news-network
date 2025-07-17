import requests
import math

def get_articles():
    response = requests.get('http://localhost:3000/api/articles')
    articles = response.json()["articles"]

    documents = [article['content'] for article in articles]
    return documents

# Normalize text

# Stop words taken from https://gist.github.com/sebleier/554280
stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

def remove_stop_words(documents):
    results = []
    for text in documents:
        # Text is an array of paragraphs
        temp = []
        is_spanish = False
        for paragraph in text:
            words = paragraph.split(" ")
            if "el" in words:
                is_spanish = True
                break
            
            for word in words:
                if word not in stop_words:
                    word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","").replace("'s","")
                    if word.isalpha():
                        temp.append(word.lower())
            
        if is_spanish:
            continue
        results.append(" ".join(temp))

    return results

def get_training_data():
    articles = get_articles()
    documents = articles[0: len(articles) * 7 // 10]

    # Corpus: documents without stop words
    corpus = remove_stop_words(documents)

    # Words: set of unique words in corpus
    words = set()
    for text in corpus:
        for word in text.split(" "):
            words.add(word)

    # Map each word to a unique ID
    word2int = {}
    for i, word in enumerate(words):
        word2int[word] = i

    # Convert documents to a list of word indices in a document
    data = []
    for index, content in enumerate(corpus):
        temp = []
        for word in content.split(" "):
            temp.append(word2int[word])
        data.append(temp)

    vocab_size = len(word2int)

    return data, vocab_size

def get_evaluation_data():
    articles = get_articles()
    documents = articles[len(articles) * 7 // 10 :]

    # Corpus: documents without stop words
    corpus = remove_stop_words(documents)

    # Words: set of unique words in corpus
    words = set()
    for text in corpus:
        for word in text.split(" "):
            words.add(word)

    # Map each word to a unique ID
    word2int = {}
    for i, word in enumerate(words):
        word2int[word] = i

    # Convert documents to a list of word indices in a document
    data = []
    for index, content in enumerate(corpus):
        temp = []
        for word in content.split(" "):
            temp.append(word2int[word])
        data.append(temp)

    vocab_size = len(word2int)

    return data, vocab_size

def replace_rare_words(corpus, min_freq=5):
    # Count word frequencies
    word_freq = {}
    for doc in corpus:
        for word in doc.split():
            word_freq[word] = word_freq.get(word, 0) + 1
    print("len word freq", len(word_freq))

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
    articles = get_articles()
    documents = articles[0: math.floor(len(articles) * 0.8)]

    # Corpus: documents without stop words
    corpus = remove_stop_words(documents)

    # Words: set of unique words in corpus
    # words = set()
    # for text in corpus:
    #     for word in text.split():
    #         words.add(word)

    # # Map each word to a unique ID
    # word2int = {"<PAD>": 0, "<UNK>": 1}

    # index = 2
    # for i, word in enumerate(words):
    #     if word not in word2int:
    #         word2int[word] = index
    #         index += 1
    # print("vocab_size", len(word2int))
    # # Convert documents to a list of word indices in a document
    # data = []
    # for index, content in enumerate(corpus):
    #     temp = []
    #     for word in content.split():
    #         temp.append(word2int[word])
    #     data.append(temp)

    data, word2int = replace_rare_words(corpus)

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

    print("vocab_size", vocab_size)

    return data, eval_data, vocab_size

