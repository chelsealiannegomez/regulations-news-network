import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import register_keras_serializable
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json

# Restate Custom Classes
@register_keras_serializable()
class ReduceMeanLayer(tf.keras.layers.Layer):
    def __init__(self, input_dim, output_dim, **kwargs):
        super().__init__(**kwargs)
        self.embedding = tf.keras.layers.Embedding(input_dim, output_dim, mask_zero=True)
        self.supports_masking = True
    def call(self, inputs, mask=None):
        x = self.embedding(inputs)
        if mask is not None:
            mask = tf.cast(mask, tf.float32)
            mask = tf.expand_dims(mask, axis=-1)

            x_masked = x * mask
            sum_x = tf.reduce_sum(x_masked, axis=1)
            count = tf.reduce_sum(mask, axis=1) + 1e-8
            mean = sum_x / count
            return mean
        return tf.reduce_mean(x, axis=1)
    def build(self, input_shape):
        self.embedding.build(input_shape)
        self.built
    def compute_output_shape(self, input_shape):
        return (input_shape[0], self.embedding.output_dim)
    
@register_keras_serializable()
class SqueezeLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.squeeze(inputs, axis=1)
    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[2])

# Load saved model
model = load_model('my_model.keras')

num_docs = 888
doc_indices = np.arange(num_docs).reshape(-1, 1)
context_size = 2  # from your code
dummy_word_input = np.zeros((num_docs, context_size * 2), dtype=np.int32)

doc_embedding_layer = model.get_layer('squeeze_doc')
embedding_model = tf.keras.Model(inputs=model.input, outputs=doc_embedding_layer.output)

doc_embeddings = embedding_model.predict([dummy_word_input, doc_indices])
np.save('doc_embeddings.npy', doc_embeddings)
np.savetxt('doc_embeddings.csv', doc_embeddings, delimiter=',')

with open('word2int.json','r') as file:
    word2int = json.load(file)

query = "children children children children children children"

def remove_stop_words(query):
    stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

    result = []
    for word in query.split():
        if word not in stop_words:
            word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","").replace("'s","")
            if word.isalpha():
                result.append(word.lower())
        
    return result

def convert_to_indices(query):
    result = []
    for word in query:
        if word in word2int:
            result.append(word2int[word])
        else:
            result.append(1)
    return result

cleaned_query = remove_stop_words(query)

# Generate testing samples
def generate_testing_samples(query, context_size):
    testing_samples = []
    # Iterate through each word in each document and return testing sample of:
    # ([context_words], doc_id, target_word)
    for index, word in enumerate(query):
        pre_context_words = query[max(0, index - context_size) : index]
        post_context_words = query[index + 1 : min(len(query), index + context_size + 1)]
        context_words = pre_context_words + post_context_words
        while len(context_words) < 4:
            context_words.append(0)
        yield context_words, 0, word

query_word_indices = convert_to_indices(cleaned_query)

query_doc_index = np.array([[-1]])

testing_samples = generate_testing_samples(query_word_indices, 2)
contexts, doc_ids, target_words = zip(*testing_samples)
contexts = np.array(contexts) # Convert to numpy arrays
doc_ids = np.array(doc_ids)
target_words = np.array(target_words)
print(contexts, doc_ids, target_words)

word_input = model.get_layer("reduce_mean_context").input
word_output = model.get_layer("reduce_mean_context").output

query_embedding_model = tf.keras.Model(inputs=word_input, outputs=word_output)

# query_embedding = embedding_model.predict([contexts, doc_ids])

query_embedding_vectors = query_embedding_model.predict(contexts)

query_embedding = np.mean(query_embedding_vectors, axis=0)


query_np_array = np.array(query_embedding)

total = []

for index in range(len(doc_embeddings)):
    doc_embedding = doc_embeddings[index]
    similarity = cosine_similarity(query_np_array.reshape(1, -1), doc_embedding.reshape(1, -1))[0][0]
    total.append([index + 1, similarity])

sorted_list = sorted(total, key=lambda x: x[1], reverse=True)
for i in sorted_list:
    print(i)