import json
import tensorflow as tf
import numpy as np

from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))

from create_model import ReduceMeanLayer

def remove_stop_words(content):
    # content: str 
    results = []
    words = content.split(" ")
    
    for word in words:
        if word not in stop_words:
            word = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","").replace("'s","")
            if word.isalpha():
                results.append(word)
    
    return results

def get_word2int():
    with open('word2int.json', 'r') as f:
        word2int = json.load(f)

    return word2int


def contents_to_word_indices(content, word2int):
    cleaned_content = remove_stop_words(content)

    data = []

    for i in cleaned_content:
        word_index = word2int.get(i, 1)
        data.append(word_index)

    return data

def generate_context(content, doc_id, context_size):
    # Iterate through each word in each document and return testing sample of:
    # ([context_words], doc_id, target_word)
    for index, word in enumerate(content):
        pre_context_words = content[max(0, index - context_size) : index]
        post_context_words = content[index + 1 : min(len(content), index + context_size + 1)]
        context_words = pre_context_words + post_context_words
        while len(context_words) < context_size * 2:
            context_words.append(0)
        yield context_words, doc_id, word


def infer_article(content, id):
    word2int = get_word2int()

    # process_article: str[] (array of words)
    process_article = contents_to_word_indices(content, word2int)

    testing_samples = generate_context(process_article, id, context_size=3)
    contexts, _, _ = zip(*testing_samples)
    contexts = np.array(contexts)

    model = tf.keras.models.load_model('doc2vec_model.keras', custom_objects={'ReduceMeanLayer': ReduceMeanLayer})

    context_encoder = tf.keras.Model(
        inputs=model.input[0],
        outputs=model.get_layer("reduce_mean_context").output
    )

    word_input_batch = contexts
    context_embeddings = context_encoder.predict(word_input_batch)
    new_doc_embedding = np.mean(context_embeddings, axis=0)

    return new_doc_embedding
