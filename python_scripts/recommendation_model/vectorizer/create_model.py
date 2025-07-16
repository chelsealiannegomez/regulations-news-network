import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import register_keras_serializable
from tensorflow.keras.models import load_model

from get_data import get_data

@register_keras_serializable()
class ReduceMeanLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.reduce_mean(inputs, axis=1)
    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[2])
    
@register_keras_serializable()
class SqueezeLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.squeeze(inputs, axis=1)
    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[2])

def create_model(num_docs, vocab_size):
    
    # Model Parameters
    embedding_dim = 100
    context_size = 2
    vocab_size = vocab_size
    num_docs = num_docs

    # Building the model

    # Instantiate Keras Tensor - a symbolic tensor-like object which we augment with certain attributes that allow us to build a Keras model just by knowing the inputs and outputs of the model
    # shape = expected input will be batches of context_size * 2 vectors, dtype = data type expected by the input
    word_input = tf.keras.layers.Input(shape=(context_size * 2,), dtype='int32')
    doc_input = tf.keras.layers.Input(shape=(1,), dtype='int32') 

    # Embeddings - turns positive integers (indexes) into dense vectors of fixed size
    word_embedding = tf.keras.layers.Embedding(
        input_dim = vocab_size,
        output_dim = embedding_dim,
    )(word_input)

    word_embedding = ReduceMeanLayer(name="reduce_mean_context")(word_embedding) # Averages the vectors of the context words to create a single vector that represents the overall context of the target word

    doc_embedding = tf.keras.layers.Embedding(
        input_dim = num_docs,
        output_dim = embedding_dim,
    )(doc_input)

    doc_embedding = SqueezeLayer(name="squeeze_doc")(doc_embedding) # Removes dimensions of size 1 from the shape of the tensor - prepares it for concatenation with context vector

    combined_embedding = tf.keras.layers.Concatenate()([word_embedding, doc_embedding]) # Concatenate word_embedding and doc_embedding

    output_layer = tf.keras.layers.Dense(
        vocab_size,
        activation="softmax"
    )(combined_embedding)

    model = tf.keras.Model(inputs=[word_input, doc_input], outputs=output_layer)

    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    return model

# Generate testing samples
def generate_testing_samples(docs, context_size):
    testing_samples = []
    # Iterate through each word in each document and return testing sample of:
    # ([context_words], doc_id, target_word)
    for doc_id, doc in enumerate(docs):
        for index, word in enumerate(doc):
            pre_context_words = doc[max(0, index - context_size) : index]
            post_context_words = doc[index + 1 : min(len(doc), index + context_size + 1)]
            context_words = pre_context_words + post_context_words
            if len(context_words) == context_size * 2:
                testing_samples.append((context_words, doc_id, word))
    return testing_samples

def train_model(contexts, doc_ids, target_words, epochs, batch_size):
    history = model.fit([contexts, doc_ids], target_words, epochs=epochs, batch_size=batch_size)
    print("Final training accuracy:", history.history['accuracy'][-1])
    
    return model


def evaluate_model(eval_data):

    evaluation_samples = generate_testing_samples(eval_data, context_size = 2)

    contexts, doc_ids, target_words = zip(*evaluation_samples)
    contexts = np.array(contexts) # Convert to numpy arrays
    doc_ids = np.array(doc_ids)
    target_words = np.array(target_words)

    model = load_model('my_model.keras', safe_mode=False)

    results = model.evaluate([contexts, doc_ids], target_words, verbose=1)

if __name__ == '__main__':
    data, eval_data, vocab_size = get_data()

    model = create_model(len(data), vocab_size)

    testing_samples = generate_testing_samples(data, context_size = 2)

    contexts, doc_ids, target_words = zip(*testing_samples)
    contexts = np.array(contexts) # Convert to numpy arrays
    doc_ids = np.array(doc_ids)
    target_words = np.array(target_words)
    
    EPOCHS = 20
    BATCH_SIZE = 32

    trained_model = train_model(contexts, doc_ids, target_words, epochs=EPOCHS, batch_size=BATCH_SIZE)

    trained_model.save('my_model.keras')

    evaluate_model(eval_data)