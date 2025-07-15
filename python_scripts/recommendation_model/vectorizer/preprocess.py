
# Normalize text

# Stop words taken from https://gist.github.com/sebleier/554280
stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

documents = [
    ['king is a strong man king man strong', 'hello'], 
    ['king is a strong man', 'hello'], 
    ['king is a strong man', 'hello'], 
    ['king is a strong man', 'hello'], 
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


# Convert documents to a list of word indices in a document
data = []
for index, content in enumerate(corpus):
    temp = []
    for word in content.split(" "):
        temp.append(word2int[word])
    data.append(temp)
    
# Model Parameters
embedding_dim = 100
context_size = 2
vocab_size = len(word2int)
num_docs = len(corpus)

# Building the model
import tensorflow as tf

# Instantiate Keras Tensor - a symbolic tensor-like object which we augment with certain attributes that allow us to build a Keras model just by knowing the inputs and outputs of the model
# shape = expected input will be batches of context_size * 2 vectors, dtype = data type expected by the input
word_input = tf.keras.layers.Input(shape=(context_size * 2,), dtype='int32')
doc_input = tf.keras.layers.Input(shape=(1,), dtype='int32') 

# Embeddings - turns positive integers (indexes) into dense vectors of fixed size
word_embedding = tf.keras.layers.Embedding(
    input_dim = vocab_size,
    output_dim = embedding_dim,
)(word_input)

word_embedding = tf.keras.layers.Lambda(lambda x: tf.reduce_mean(x, axis=1))(word_embedding) # Averages the vectors of the context words to create a single vector that represents the overall context of the target word

doc_embedding = tf.keras.layers.Embedding(
    input_dim = num_docs,
    output_dim = embedding_dim,
)(doc_input)

doc_embedding = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(doc_embedding) # Removes dimensions of size 1 from the shape of the tensor - prepares it for concatenation with context vector

combined_embedding = tf.keras.layers.Concatenate()([word_embedding, doc_embedding]) # Concatenate word_embedding and doc_embedding

output_layer = tf.keras.layers.Dense(
    vocab_size,
    activation="softmax"
)(combined_embedding)

model = tf.keras.Model(inputs=[word_input, doc_input], outputs=output_layer)

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

print(model)


# Generate testing samples