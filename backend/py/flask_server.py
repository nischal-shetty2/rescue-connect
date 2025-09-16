from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image
import io
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load your actual CNN model
# Path relative to the project root (two levels up from backend/py/)
MODEL_PATH = '../../disease_Model/model/model.h5'
try:
    print("🔄 Loading CNN model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ CNN model loaded successfully!")
    
    # Define your class names (update these to match your model)
    CLASS_NAMES = ['Bacterial', 'Fungal', 'Healthy']
    MODEL_LOADED = True
    
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("🔄 Falling back to mock predictions")
    model = None
    CLASS_NAMES = ['Bacterial', 'Fungal', 'Healthy']
    MODEL_LOADED = False

def preprocess_image(image):
    """
    Preprocess image for your CNN model
    Update this function to match your exact preprocessing steps
    """
    try:
        # Resize to the input size your model expects (usually 150x150 or 224x224)
        target_size = (150, 150)  # Update this to match your model's input size
        image = image.resize(target_size)
        
        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values (0-255 to 0-1)
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
        
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_disease():
    try:
        # Check if file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        animal_type = request.form.get('animalType', 'dog')
        symptoms = request.form.get('symptoms', '[]')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            
            if MODEL_LOADED and model is not None:
                # 🚀 USE ACTUAL CNN MODEL
                try:
                    # Open and preprocess the image
                    image = Image.open(file.stream)
                    processed_image = preprocess_image(image)
                    
                    if processed_image is None:
                        raise Exception("Failed to preprocess image")
                    
                    # Make prediction using your trained model
                    predictions = model.predict(processed_image, verbose=0)
                    
                    # Get the predicted class and confidence
                    predicted_class_index = np.argmax(predictions[0])
                    predicted_class = CLASS_NAMES[predicted_class_index]
                    confidence = float(predictions[0][predicted_class_index]) * 100
                    
                    # Get all probabilities
                    all_probabilities = {
                        CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 1) 
                        for i in range(len(CLASS_NAMES))
                    }
                    
                    print(f"🔍 CNN Model Prediction: {predicted_class} ({confidence:.1f}% confidence)")
                    print(f"📊 All probabilities: {all_probabilities}")
                    
                    result = {
                        'disease': predicted_class,
                        'confidence': round(confidence, 1),
                        'severity': get_severity(predicted_class, confidence),
                        'description': get_disease_description(predicted_class),
                        'symptoms': get_symptoms(predicted_class),
                        'treatment': get_treatment_recommendations(predicted_class),
                        'urgency': get_urgency_level(predicted_class, confidence),
                        'all_probabilities': all_probabilities,
                        'model_used': 'CNN',
                        'model_status': 'active'
                    }
                    
                    return jsonify(result)
                    
                except Exception as model_error:
                    print(f"❌ CNN Model error: {model_error}")
                    print("🔄 Falling back to mock predictions")
                    # Fall through to mock predictions
            
            # 🎭 FALLBACK TO MOCK DATA (if model fails or not loaded)
            import random
            
            bacterial_prob = random.uniform(10, 95)
            fungal_prob = random.uniform(10, 95)
            healthy_prob = random.uniform(10, 95)
            
            total = bacterial_prob + fungal_prob + healthy_prob
            bacterial_prob = (bacterial_prob / total) * 100
            fungal_prob = (fungal_prob / total) * 100
            healthy_prob = (healthy_prob / total) * 100
            
            probabilities = {
                'Bacterial': bacterial_prob,
                'Fungal': fungal_prob,
                'Healthy': healthy_prob
            }
            
            predicted_class = max(probabilities.keys(), key=lambda k: probabilities[k])
            confidence = probabilities[predicted_class]
            
            result = {
                'disease': predicted_class,
                'confidence': round(confidence, 1),
                'severity': get_severity(predicted_class, confidence),
                'description': get_disease_description(predicted_class),
                'symptoms': get_symptoms(predicted_class),
                'treatment': get_treatment_recommendations(predicted_class),
                'urgency': get_urgency_level(predicted_class, confidence),
                'all_probabilities': {
                    'Bacterial': round(bacterial_prob, 1),
                    'Fungal': round(fungal_prob, 1),
                    'Healthy': round(healthy_prob, 1)
                },
                'model_used': 'Mock',
                'model_status': 'fallback'
            }
            
            print(f"🎭 Mock prediction: {predicted_class} ({confidence:.1f}% confidence)")
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_severity(disease, confidence):
    if disease == 'Healthy':
        return 'low'
    elif confidence > 80:
        return 'high'
    elif confidence > 60:
        return 'medium'
    else:
        return 'low'

def get_disease_description(disease):
    descriptions = {
        'Bacterial': 'Bacterial skin infection caused by harmful bacteria affecting the skin tissue',
        'Fungal': 'Fungal skin infection caused by fungi that can spread on the skin surface',
        'Healthy': 'No signs of skin disease detected. The skin appears healthy and normal'
    }
    return descriptions.get(disease, 'Unknown condition')

def get_symptoms(disease):
    symptoms_map = {
        'Bacterial': ['Redness', 'Swelling', 'Pus formation', 'Pain', 'Warmth'],
        'Fungal': ['Itching', 'Scaling', 'Circular patches', 'Hair loss', 'Discoloration'],
        'Healthy': ['Normal skin color', 'No irritation', 'No unusual patches']
    }
    return symptoms_map.get(disease, [])

def get_treatment_recommendations(disease):
    treatments = {
        'Bacterial': {
            'medication': 'Antibiotic cream or oral antibiotics',
            'dosage': 'As prescribed by veterinarian',
            'topical': 'Antiseptic wash',
            'additional': ['Keep area clean', 'Prevent licking/scratching', 'Complete full course of antibiotics']
        },
        'Fungal': {
            'medication': 'Antifungal medication',
            'dosage': 'As prescribed by veterinarian',
            'topical': 'Antifungal shampoo',
            'additional': ['Isolate from other animals', 'Clean environment', 'Monitor for spread']
        },
        'Healthy': {
            'medication': 'No medication needed',
            'dosage': 'N/A',
            'topical': 'Regular grooming',
            'additional': ['Maintain good hygiene', 'Regular check-ups', 'Balanced diet']
        }
    }
    return treatments.get(disease, {})

def get_urgency_level(disease, confidence):
    if disease == 'Healthy':
        return 'No action needed - Continue regular care'
    elif disease == 'Bacterial' and confidence > 70:
        return 'High - Schedule vet visit within 24-48 hours'
    elif disease == 'Fungal' and confidence > 70:
        return 'Moderate - Schedule vet visit within 3-5 days'
    else:
        return 'Low - Monitor and consult vet if symptoms worsen'

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flask server running'})

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    print("🚀 Starting Animal Skin Disease Prediction API...")
    print("📡 Server running on: http://localhost:5001")
    print("🔗 API endpoint: http://localhost:5001/api/analyze")
    print("❤️  Health check: http://localhost:5001/api/health")
    print("\n📝 Ready to connect with your CNN model!")
    print("   Replace the mock prediction code with your actual model.predict() call")
    app.run(debug=True, host='0.0.0.0', port=5001)
