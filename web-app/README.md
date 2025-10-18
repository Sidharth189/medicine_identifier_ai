# Medicine Identification Web App

React web application for AI-powered medicine identification with text-to-speech and multilingual support.

## Features

- 📱 **Camera Integration**: Take photos directly or upload from device
- 🤖 **AI Recognition**: Identify medicines using trained model
- 🔊 **Text-to-Speech**: Audio feedback in multiple languages
- 🌍 **Multilingual**: 12+ language support
- 💊 **Medicine Details**: Comprehensive medicine information
- 🎨 **Modern UI**: Responsive design with beautiful animations

## Setup Instructions

### 1. Install Dependencies
```bash
cd web-app
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Backend Setup
Make sure your FastAPI backend is running on `http://localhost:8000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Features

### Pages
1. **Home Page**: Main interface with camera/upload options
2. **Camera Page**: Live camera view for taking photos
3. **Results Page**: Display identified medicine with details
4. **Settings Page**: Language and accessibility settings

### Technologies
- React 18
- React Router DOM
- Styled Components
- React Speech Kit
- Axios for API calls
- Lucide React for icons
- Framer Motion for animations

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Camera Permissions

The app requires camera access for photo capture. Make sure to grant permissions when prompted.

## Troubleshooting

### Common Issues
1. **Camera not working**: Check browser permissions
2. **API connection failed**: Ensure backend is running
3. **TTS not working**: Check browser support for speech synthesis

### Development Tips
- Use Chrome DevTools for debugging
- Check Network tab for API calls
- Use Console for error messages
