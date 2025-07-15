import io
import re
import string
import tqdm

import numpy as np

import tensorflow as tf
from tensorflow.keras import layers

SEED = 42
AUTOTUNE = tf.data.AUTOTUNE

sentence = "The wide road shimmered in the hot sun."

# Tokenize sentence
tokens = list(sentence.lower().split())

# Create a vocabulary to save mappings from tokens to integer indices
vocab, index = {}, 1
vocab['<pad>'] = 0
for token in tokens:
    if token not in vocab:
        vocab[token] = index
        index += 1
vocab_size = len(vocab)

# Create an inverse vocabulary to save mappings from integer indices to tokens
inverse_vocab = {index: token for token, index in vocab.items()}

# Vectorize your sentence
example_sequence = [vocab[word] for word in tokens]
print(example_sequence)

# Generate positive skip-grams from one sentence (could implement this from scratch)
window_size = 2
positive_skip_grams, _ = tf.keras.preprocessing.sequence.skipgrams(
    example_sequence,
    vocabulary_size = vocab_size,
    window_size = window_size,
    negative_samples = 0,
    seed = SEED
)


for target, context in positive_skip_grams: 
    print(f"({target}, {context}) : ({inverse_vocab[target]}, {inverse_vocab[context]})")