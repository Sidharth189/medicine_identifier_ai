# Medicine Identification API

FastAPI backend for the Medicine Identification mobile app. Provides AI-powered medicine recognition, text-to-speech, and multilingual translation services.

## Features

- 🤖 **Medicine Prediction**: Upload images and get AI-powered medicine identification
- 🔊 **Text-to-Speech**: Convert text to speech in multiple languages
- 🌍 **Translation**: Translate text between 12+ languages
- 📊 **Medicine Database**: Detailed information about medicines
- 🚀 **Fast API**: High-performance async endpoints

## API Endpoints

### Medicine Identification
- `POST /predict` - Upload image and get medicine prediction
- `GET /medicine/{name}` - Get detailed medicine information
- `GET /medicines` - List all available medicines

### Text-to-Speech
- `POST /text-to-speech?text={text}&language={lang}` - Convert text to speech

### Translation
- `POST /translate?text={text}&target_language={lang}` - Translate text

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Place your trained model:**
   - Copy `medicine_model.pth` to this directory
   - Update class names in `main.py`

3. **Run the server:**
   ```bash
   python main.py
   ```

## Configuration

### Model Setup
Update the following in `main.py`:
- Model architecture (currently MobileNetV2)
- Number of classes
- Class names list
- Model file path

### Database
Add new medicines to `medicine_database.json`:
```json
{
  "Medicine Name": {
    "purpose": "What it's used for",
    "dosage": "How to take it",
    "side_effects": "Possible side effects",
    "precautions": "Important warnings"
  }
}
```

## Testing

Visit `http://localhost:8000/docs` for interactive API documentation.

## Deployment

For production deployment:
1. Use a production ASGI server like Gunicorn
2. Set up proper CORS origins
3. Configure environment variables
4. Use HTTPS for security
