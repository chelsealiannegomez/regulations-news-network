from create_model import generate_testing_samples
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

def evaluate_model(eval_data):

    evaluation_samples = generate_testing_samples(eval_data, context_size = 2)

    contexts, doc_ids, target_words = zip(*evaluation_samples)
    contexts = np.array(contexts) # Convert to numpy arrays
    doc_ids = np.array(doc_ids)
    target_words = np.array(target_words)

    model = load_model('my_model.keras', safe_mode=False)

    results = model.evaluate([contexts, doc_ids], target_words, verbose=1)