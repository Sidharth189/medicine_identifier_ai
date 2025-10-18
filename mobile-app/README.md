# Medicine Identification Mobile App

React Native (Expo) mobile application for AI-powered medicine identification with text-to-speech and multilingual support.

## Features

- 📱 **Camera Integration**: Take photos or select from gallery
- 🤖 **AI Recognition**: Identify medicines using trained model
- 🔊 **Text-to-Speech**: Audio feedback in multiple languages
- 🌍 **Multilingual**: 12+ language support
- 💊 **Medicine Details**: Comprehensive medicine information
- 🎨 **Modern UI**: Vibrant, accessible interface

## Screens

1. **Home Screen**: Main interface with camera/gallery options
2. **Camera Screen**: Live camera view for taking photos
3. **Results Screen**: Display identified medicine with details
4. **Settings Screen**: Language and accessibility settings

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update API URL:**
   - Edit `src/services/api.js`
   - Change `API_BASE_URL` to your FastAPI server URL

3. **Start development:**
   ```bash
   npx expo start
   ```

## Configuration

### API Connection
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-server-url:8000';
```

### Languages
Add new languages in `src/hooks/useTranslation.js`:
1. Add language code to `translations_data`
2. Add translations for all text keys
3. Update language selector in HomeScreen

### UI Customization
- Colors: `src/theme/theme.js`
- Components: Individual screen files
- Icons: React Native Vector Icons

## Building

### Development
```bash
npx expo start
```

### Production Build
```bash
npx expo build:android
npx expo build:ios
```

## Permissions

The app requires:
- Camera access for taking photos
- Storage access for image selection
- Microphone access for voice features

## Troubleshooting

### Common Issues
1. **API Connection**: Check server URL and network
2. **Camera**: Grant permissions in device settings
3. **TTS**: Check internet connection
4. **Build Errors**: Clear cache with `npx expo start -c`

### Debug Mode
```bash
npx expo start --dev
```
