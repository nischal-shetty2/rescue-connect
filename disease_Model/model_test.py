from tensorflow import keras
from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np
import os

def preprocess_image(file_path):
    img = image.load_img(file_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize pixel values between 0 and 1
    return img_array

def testimage(inputimg):
    prepimg = preprocess_image(inputimg)
    predictions = model.predict(prepimg)
    predicted_class = np.argmax(predictions, axis=1)
    index = predicted_class[0]
    result = "Healthy" if index == 2 else "Fungal" if index == 1 else "Bacterial"
    print("Predicted class:", result)

# Load converted model
model = tf.keras.models.load_model('./model/model.h5')

# Get a list of files in the test folder
files = os.listdir("./src/Test")

# Print the available files
print("Available files:")
for i, file in enumerate(files):
    print(f"{i+1}. {file}")

test = input("Enter the number of the file you want to test: ")

# Get the file Path

file_path = os.path.join("./src/Test", files[int(test) - 1])

# Predict the selected Image

testimage(file_path)