import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import register_keras_serializable
from tensorflow.keras.models import load_model
from tensorflow.keras import regularizers

# Test masking custom class
# Ensures that 0s do not affect overall results

@register_keras_serializable()
class ReduceMeanLayer(tf.keras.layers.Layer):
    def __init__(self, input_dim, output_dim, **kwargs):
        super().__init__(**kwargs)
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
    
layer = ReduceMeanLayer(input_dim=5, output_dim=4)
layer.embedding.build((None, None))

embedding_weights = np.ones((5, 4), dtype=np.float32)
embedding_weights[0] = np.array([10., 10., 10., 10.])
layer.embedding.set_weights([embedding_weights])

input_with_padding = tf.constant([[1, 2, 0, 0]])

output_with_mask = layer(input_with_padding)
embedding_layer = layer.embedding
x = embedding_layer(input_with_padding)
output_without_mask = tf.reduce_mean(x, axis=1)

print("Output with masking:")
print(output_with_mask.numpy())

print()

print("Output without masking:")
print(output_without_mask.numpy())
