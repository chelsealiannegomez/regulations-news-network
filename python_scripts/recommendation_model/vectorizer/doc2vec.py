# Normalize text

# Stop words taken from https://gist.github.com/sebleier/554280
stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

documents = [
    ['apple is a fruit', 'cucumber is a vegetable'], 
    ['python is a programming language', 'c is weakly typed'], 
    ['king is a strong man', 'queen is a strong woman'], 
]

def remove_stop_words(documents):
    results = []
    for text in documents:
        print(text)
        # Text is an array of paragraphs
        temp = []
        for paragraph in text:
            print(paragraph)
            words = paragraph.split(" ")

            for word in words:
                if word not in stop_words:
                    temp.append(word.lower())
        results.append(" ".join(temp))

    return results

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
