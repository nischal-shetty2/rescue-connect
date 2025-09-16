# Training and Integration Workflow

## Step 1: Prepare Your Environment

```bash
# Navigate to the disease model directory
cd /Users/nischalshetty/Documents/utils/college/rescue-connect/disease_Model

# Install required packages (if not already installed)
pip install tensorflow matplotlib seaborn scikit-learn pandas
pip install tensorflowjs  # For web model export
```

## Step 2: Run the Improved Training

1. Open `model_train_improved.ipynb` in Jupyter/VS Code
2. Run all cells sequentially
3. The training will:
   - Phase 1: Train with frozen EfficientNet base (20 epochs)
   - Phase 2: Fine-tune with unfrozen layers (up to 100 epochs)
   - Stop early if validation loss doesn't improve

## Step 3: Monitor Training

- Watch the training plots in real-time
- Check validation accuracy (should reach >90% with enough data)
- Review confusion matrix for per-class performance
- Look for overfitting (training acc >> validation acc)

## Step 4: Integrate Trained Model

### Backend Integration (Flask):

```python
# Update your flask_server.py
import tensorflow as tf

# Load the improved model
model = tf.keras.models.load_model('improved_model_TIMESTAMP.h5')

def predict_disease(image_path):
    # Preprocess image to 224x224 (EfficientNet input size)
    img = tf.keras.preprocessing.image.load_img(
        image_path, target_size=(224, 224)
    )
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) / 255.0

    predictions = model.predict(img_array)
    predicted_class = tf.argmax(predictions[0])
    confidence = tf.reduce_max(predictions[0])

    classes = ['Bacterial', 'Fungal', 'Healthy']
    return {
        'disease': classes[predicted_class],
        'confidence': float(confidence),
        'all_predictions': {
            classes[i]: float(predictions[0][i])
            for i in range(3)
        }
    }
```

### Frontend Integration (React):

```javascript
// Load TensorFlow.js model
import * as tf from '@tensorflow/tfjs'

const loadModel = async () => {
  const model = await tf.loadLayersModel('/model/model.json')
  return model
}

const predictDisease = async (imageElement, model) => {
  // Preprocess image to 224x224
  const tensor = tf.browser
    .fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0)
    .div(255.0)

  const predictions = await model.predict(tensor).data()
  const classes = ['Bacterial', 'Fungal', 'Healthy']

  return {
    disease: classes[predictions.indexOf(Math.max(...predictions))],
    confidence: Math.max(...predictions),
    all_predictions: Object.fromEntries(classes.map((cls, i) => [cls, predictions[i]])),
  }
}
```

## Step 5: Test the Integration

1. Use the generated `test_model.py` script
2. Test with sample images from your test set
3. Verify predictions make sense
4. Check confidence scores are reasonable

## Model Files You'll Get:

After training, you'll have these files in `disease_Model/model/`:

- `improved_model_TIMESTAMP.h5` → Copy to `backend/py/`
- `optimized_model_TIMESTAMP.tflite` → For mobile apps
- `tfjs_TIMESTAMP/` → Copy to `frontend/public/model/`
- `model_info_TIMESTAMP.json` → Contains model metadata
- `training_history.png` → Training visualization
- `confusion_matrix.png` → Evaluation results

## Data Expansion Strategy:

When you collect more data for cats and cows:

1. Create subdirectories in each class:

   ```
   src/Train/Bacterial/dogs/
   src/Train/Bacterial/cats/
   src/Train/Bacterial/cows/
   ```

2. The model will learn to classify diseases regardless of species

3. Consider species-specific data if diseases manifest differently

## Performance Expectations:

With current data (75 training images):

- Expect 70-85% accuracy (limited by small dataset)
- Model may overfit quickly

With expanded data (500+ per class):

- Expect 90%+ accuracy
- Better generalization to new images
- More robust predictions

## Troubleshooting:

- **Low accuracy**: Need more diverse data
- **Overfitting**: Reduce model complexity or add more data
- **Poor on real images**: Need more realistic training data
- **Class confusion**: Check if labels are correct
