from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import os
from typing import Dict, Any
import uvicorn
from gtts import gTTS
import base64
from googletrans import Translator
import tempfile
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_model()
    load_medicine_database()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="Medicine Identification API", 
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and class names
model = None
class_names = None
medicine_database = None

def load_model():
    """Load the trained medicine identification model"""
    global model, class_names
    
    model_path = "medicine_model.pth"
    if os.path.exists(model_path):
        # Load the model state dict to get the correct number of classes
        state_dict = torch.load(model_path, map_location='cpu')
        
        # Extract the number of classes from the classifier layer
        num_classes = state_dict['classifier.1.weight'].shape[0]
        print(f"📊 Detected {num_classes} classes in the model")
        
        # Initialize MobileNetV2 with the correct number of classes
        model = models.mobilenet_v2(pretrained=False)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
        
        # Load the trained weights
        model.load_state_dict(state_dict)
        model.eval()
        print("✅ Model loaded successfully")
    else:
        print("⚠️ Model file not found, using random weights")
        # Fallback to a default number of classes
        model = models.mobilenet_v2(pretrained=False)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, 150)  # Default to 150 classes
        class_names = [f"Class_{i}" for i in range(150)]
        return
    
    # Load class names from a separate file or use default names
    class_names_path = "class_names.json"
    if os.path.exists(class_names_path):
        with open(class_names_path, 'r') as f:
            class_names = json.load(f)
        print(f"✅ Loaded {len(class_names)} class names")
    else:
        # Create default class names if no file exists
        class_names = [f"Medicine_{i+1}" for i in range(num_classes)]
        print(f"⚠️ No class names file found, using default names")

def load_medicine_database():
    """Load the medicine database JSON"""
    global medicine_database
    
    database_path = "medicine_database.json"
    if os.path.exists(database_path):
        with open(database_path, 'r', encoding='utf-8') as f:
            medicine_database = json.load(f)
        print("✅ Medicine database loaded successfully")
    else:
        print("⚠️ Medicine database not found")
        medicine_database = {}

# Model and database are now loaded in the lifespan function above

# Image preprocessing transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.get("/")
async def root():
    return {"message": "Medicine Identification API is running!"}

@app.post("/predict")
async def predict_medicine(file: UploadFile = File(...)):
    """Predict medicine from uploaded image"""
    try:
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Transform image
        image_tensor = transform(image).unsqueeze(0)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
        
        predicted_class = class_names[predicted.item()]
        
        # Get medicine details from database
        medicine_info = medicine_database.get(predicted_class, {})
        
        return {
            "predicted_medicine": predicted_class,
            "confidence": round(confidence, 4),
            "medicine_info": medicine_info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/medicine/{medicine_name}")
async def get_medicine_info(medicine_name: str):
    """Get detailed information about a specific medicine"""
    if medicine_name in medicine_database:
        return {
            "medicine_name": medicine_name,
            "details": medicine_database[medicine_name]
        }
    else:
        raise HTTPException(status_code=404, detail="Medicine not found in database")

@app.get("/medicines")
async def get_all_medicines():
    """Get list of all medicines in database"""
    return {"medicines": list(medicine_database.keys())}

@app.post("/text-to-speech")
async def text_to_speech(text: str, language: str = "en"):
    """Convert text to speech using Google TTS"""
    try:
        # Language code mapping
        lang_codes = {
            "en": "en",
            "es": "es", 
            "fr": "fr",
            "de": "de",
            "it": "it",
            "pt": "pt",
            "ru": "ru",
            "ja": "ja",
            "ko": "ko",
            "zh": "zh",
            "hi": "hi",
            "ar": "ar"
        }
        
        tts_lang = lang_codes.get(language, "en")
        
        # Generate speech
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            tts.save(tmp_file.name)
            
            # Read file and encode to base64
            with open(tmp_file.name, "rb") as audio_file:
                audio_data = base64.b64encode(audio_file.read()).decode('utf-8')
            
            # Clean up temporary file
            os.unlink(tmp_file.name)
        
        return {
            "text": text,
            "language": language,
            "audio_data": audio_data,
            "success": True
        }
        
    except Exception as e:
        return {
            "text": text,
            "language": language,
            "error": str(e),
            "success": False
        }

@app.post("/translate")
async def translate_text(text: str, target_language: str = "en"):
    """Translate text using Google Translate"""
    try:
        translator = Translator()
        
        # Language code mapping
        lang_codes = {
            "en": "en",
            "es": "es", 
            "fr": "fr",
            "de": "de",
            "it": "it",
            "pt": "pt",
            "ru": "ru",
            "ja": "ja",
            "ko": "ko",
            "zh": "zh",
            "hi": "hi",
            "ar": "ar"
        }
        
        target_lang = lang_codes.get(target_language, "en")
        
        # Translate text
        result = translator.translate(text, dest=target_lang)
        
        return {
            "original_text": text,
            "translated_text": result.text,
            "target_language": target_language,
            "detected_language": result.src,
            "success": True
        }
        
    except Exception as e:
        return {
            "original_text": text,
            "error": str(e),
            "success": False
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
