import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import register_keras_serializable
from tensorflow.keras.models import load_model
from tensorflow.keras import regularizers

from get_data import get_data

@register_keras_serializable()
class ReduceMeanLayer(tf.keras.layers.Layer):
    def __init__(self, input_dim, output_dim, embedding_matrix=None, **kwargs):
        super().__init__(**kwargs)
        if embedding_matrix is not None:
            self.embedding = tf.keras.layers.Embedding(
                input_dim = input_dim,
                output_dim = output_dim,
                weights = [embedding_matrix],
                trainable = True,
                mask_zero = True
            )
        else:
            self.embedding = tf.keras.layers.Embedding(input_dim, output_dim, mask_zero=True)
        self.supports_masking = True
    def call(self, inputs, mask=None):
        if mask is None:
            mask = self.embedding.compute_mask(inputs)
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
    def compute_mask(self, inputs, mask=None):
        return mask
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
    
context_size = 3

def load_glove_embeddings(glove_file_path, word_index, embedding_dim=100):

    embeddings_index = {}
    with open(glove_file_path, 'r', encoding='utf8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            coeffs = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = coeffs

    hits = sum(1 for word in word2int if word in embeddings_index)
    print(f"{hits} / {len(word2int)} words found in GloVe")

    vocab_size = len(word_index) + 1
    embedding_matrix = np.random.normal(size=(vocab_size, embedding_dim)) * 0.01

    for word, i in word2int.items():
        vector = embeddings_index.get(word)
        if vector is not None:
            embedding_matrix[i] = vector
    np.save('embedding_matrix.npy', embedding_matrix)
    return embedding_matrix
    
def create_model(num_docs, word2int):
    
    # Model Parameters
    embedding_dim = 100
    vocab_size = len(word2int) + 1
    num_docs = num_docs 

    embedding_matrix = load_glove_embeddings('./glove.6B.100d.txt', word2int, embedding_dim)


    # Building the model

    # Instantiate Keras Tensor - a symbolic tensor-like object which we augment with certain attributes that allow us to build a Keras model just by knowing the inputs and outputs of the model
    # shape = expected input will be batches of context_size * 2 vectors, dtype = data type expected by the input
    word_input = tf.keras.layers.Input(shape=(context_size * 2,), dtype='int32')
    doc_input = tf.keras.layers.Input(shape=(1,), dtype='int32') 

    # Embeddings - turns positive integers (indexes) into dense vectors of fixed size

    word_embedding = ReduceMeanLayer(input_dim=vocab_size, output_dim=embedding_dim,embedding_matrix=embedding_matrix, name="reduce_mean_context")(word_input) # Averages the vectors of the context words to create a single vector that represents the overall context of the target word

    doc_embedding = tf.keras.layers.Embedding(
        input_dim = num_docs,
        output_dim = embedding_dim,
        name = "doc_embedding"
    )(doc_input)

    doc_embedding = SqueezeLayer(name="squeeze_doc")(doc_embedding) # Removes dimensions of size 1 from the shape of the tensor - prepares it for concatenation with context vector

    combined_embedding = tf.keras.layers.Concatenate()([word_embedding, doc_embedding]) # Concatenate word_embedding and doc_embedding

    combined_embedding = tf.keras.layers.Dropout(0.3)(combined_embedding)

    output_layer = tf.keras.layers.Dense(
        vocab_size,
        activation="softmax",
        kernel_regularizer=regularizers.l2(0.0001)
    )(combined_embedding)
    

    model = tf.keras.Model(inputs=[word_input, doc_input], outputs=output_layer)

    optimizer = tf.keras.optimizers.Adam(learning_rate = 0.001)

    model.compile(optimizer=optimizer, loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    return model

# Generate testing samples
def generate_testing_samples(docs, context_size):
    # Iterate through each word in each document and return testing sample of:
    # ([context_words], doc_id, target_word)
    for doc_id, doc in enumerate(docs):
        for index, word in enumerate(doc):
            pre_context_words = doc[max(0, index - context_size) : index]
            post_context_words = doc[index + 1 : min(len(doc), index + context_size + 1)]
            context_words = pre_context_words + post_context_words
            while len(context_words) < context_size * 2:
                context_words.append(0)
            yield context_words, doc_id, word

def train_model(model, contexts, doc_ids, target_words, epochs, batch_size):
    early_stop = tf.keras.callbacks.EarlyStopping(
        monitor='loss',
        patience=1,
        restore_best_weights=True
    )

    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='loss', factor=0.5,
        patience=0, min_lr=0.00001)
    
    history = model.fit([contexts, doc_ids], target_words, epochs=epochs, batch_size=batch_size, callbacks=[early_stop, reduce_lr], shuffle=True)
    print("Final training accuracy:", history.history['accuracy'][-1])
    
    return model

if __name__ == '__main__':
    data, eval_data, word2int = get_data()

    testing_samples = generate_testing_samples(data, context_size)
    eval_samples = generate_testing_samples(eval_data, context_size)

    model = create_model(len(data), word2int)

    contexts, doc_ids, target_words = zip(*testing_samples)
    contexts = np.array(contexts) # Convert to numpy arrays
    doc_ids = np.array(doc_ids)
    target_words = np.array(target_words)
    
    EPOCHS = 30
    BATCH_SIZE = 32

    trained_model = train_model(model, contexts, doc_ids, target_words, epochs=EPOCHS, batch_size=BATCH_SIZE)

    word_embeddings = model.get_layer("reduce_mean_context").embedding.get_weights()[0]

    doc_embeddings = model.get_layer("doc_embedding").get_weights()[0]

    np.save('doc_embeddings.npy', doc_embeddings)
    np.savetxt('doc_embeddings.csv', doc_embeddings, delimiter=',')

    np.save('word_embeddings.npy', word_embeddings)
    np.savetxt('word_embeddings.csv', word_embeddings, delimiter=',')

    # Evaluate Data
    contexts, doc_ids, target_words = zip(*eval_samples)
    contexts = np.array(contexts) # Convert to numpy arrays
    doc_ids = np.array(doc_ids)
    target_words = np.array(target_words)
    results = model.evaluate([contexts, doc_ids], target_words, verbose=1)