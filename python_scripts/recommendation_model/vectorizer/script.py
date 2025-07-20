import numpy as np

x = np.load('doc_ids.npy')
for i in range(len(x)):
    print(f"Doc_id {i} maps to article with id {x[i]}")