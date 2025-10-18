import { useState, useEffect, createContext, useContext } from 'react';
import { translateText } from '../services/api';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  const translations_data = {
    en: {
      app_title: 'Medicine Identifier',
      app_description: 'Identify medicines using AI-powered image recognition',
      identify_medicine: 'Identify Medicine',
      identify_description: 'Take a photo or upload an image to identify medicine and get detailed information',
      take_photo: 'Take Photo',
      choose_from_gallery: 'Choose from Gallery',
      recent_predictions: 'Recent Predictions',
      features: 'Features',
      camera_integration: 'Camera Integration',
      text_to_speech: 'Text to Speech',
      multilingual_support: 'Multilingual Support',
      medicine_database: 'Medicine Database',
      listen: 'Listen',
      identified_medicine: 'Identified Medicine',
      confidence: 'Confidence',
      high_confidence: 'High Confidence',
      medium_confidence: 'Medium Confidence',
      low_confidence: 'Low Confidence',
      prediction_confidence: 'Prediction Confidence',
      medicine_details: 'Medicine Details',
      scan_another: 'Scan Another',
      back_to_home: 'Back to Home',
      listen_medicine: 'Listen Medicine',
      listen_details: 'Listen Details',
      requesting_camera_permission: 'Requesting camera permission...',
      camera_permission_denied: 'Camera permission denied',
      grant_permission: 'Grant Permission',
      position_medicine_here: 'Position medicine here',
      processing: 'Processing...',
      tap_to_capture: 'Tap to capture',
      language_settings: 'Language Settings',
      language_description: 'Choose your preferred language',
      accessibility_settings: 'Accessibility Settings',
      auto_speak_results: 'Auto Speak Results',
      auto_speak_description: 'Automatically speak medicine identification results',
      haptic_feedback: 'Haptic Feedback',
      haptic_feedback_description: 'Vibrate on interactions',
      notifications: 'Notifications',
      notifications_description: 'Receive notifications for updates',
      speech_settings: 'Speech Settings',
      test_speech: 'Test Speech',
      app_settings: 'App Settings',
      clear_cache: 'Clear Cache',
      clear_cache_confirmation: 'Are you sure you want to clear the cache?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      success: 'Success',
      cache_cleared: 'Cache cleared successfully',
      about: 'About',
      app_version: 'App Version',
      developed_by: 'Developed By',
      medicine_database_version: 'Medicine Database Version',
      language_changed: 'Language changed successfully',
      speech_test_message: 'This is a test of the text-to-speech functionality',
      purpose: 'Purpose',
      dosage: 'Dosage',
      side_effects: 'Side Effects',
      precautions: 'Precautions',
    },
    es: {
      app_title: 'Identificador de Medicamentos',
      app_description: 'Identifica medicamentos usando reconocimiento de imágenes con IA',
      identify_medicine: 'Identificar Medicamento',
      identify_description: 'Toma una foto o sube una imagen para identificar medicamentos y obtener información detallada',
      take_photo: 'Tomar Foto',
      choose_from_gallery: 'Elegir de la Galería',
      recent_predictions: 'Predicciones Recientes',
      features: 'Características',
      camera_integration: 'Integración de Cámara',
      text_to_speech: 'Texto a Voz',
      multilingual_support: 'Soporte Multilingüe',
      medicine_database: 'Base de Datos de Medicamentos',
      listen: 'Escuchar',
      identified_medicine: 'Medicamento Identificado',
      confidence: 'Confianza',
      high_confidence: 'Alta Confianza',
      medium_confidence: 'Confianza Media',
      low_confidence: 'Baja Confianza',
      prediction_confidence: 'Confianza de Predicción',
      medicine_details: 'Detalles del Medicamento',
      scan_another: 'Escanear Otro',
      back_to_home: 'Volver al Inicio',
      listen_medicine: 'Escuchar Medicamento',
      listen_details: 'Escuchar Detalles',
      requesting_camera_permission: 'Solicitando permiso de cámara...',
      camera_permission_denied: 'Permiso de cámara denegado',
      grant_permission: 'Otorgar Permiso',
      position_medicine_here: 'Posiciona el medicamento aquí',
      processing: 'Procesando...',
      tap_to_capture: 'Toca para capturar',
      language_settings: 'Configuración de Idioma',
      language_description: 'Elige tu idioma preferido',
      accessibility_settings: 'Configuración de Accesibilidad',
      auto_speak_results: 'Hablar Resultados Automáticamente',
      auto_speak_description: 'Hablar automáticamente los resultados de identificación de medicamentos',
      haptic_feedback: 'Retroalimentación Háptica',
      haptic_feedback_description: 'Vibrar en las interacciones',
      notifications: 'Notificaciones',
      notifications_description: 'Recibir notificaciones para actualizaciones',
      speech_settings: 'Configuración de Voz',
      test_speech: 'Probar Voz',
      app_settings: 'Configuración de la App',
      clear_cache: 'Limpiar Caché',
      clear_cache_confirmation: '¿Estás seguro de que quieres limpiar el caché?',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      success: 'Éxito',
      cache_cleared: 'Caché limpiado exitosamente',
      about: 'Acerca de',
      app_version: 'Versión de la App',
      developed_by: 'Desarrollado Por',
      medicine_database_version: 'Versión de la Base de Datos',
      language_changed: 'Idioma cambiado exitosamente',
      speech_test_message: 'Esta es una prueba de la funcionalidad de texto a voz',
      purpose: 'Propósito',
      dosage: 'Dosis',
      side_effects: 'Efectos Secundarios',
      precautions: 'Precauciones',
    },
    hi: {
      app_title: 'दवा पहचानकर्ता',
      app_description: 'AI-संचालित छवि पहचान का उपयोग करके दवाओं की पहचान करें',
      identify_medicine: 'दवा की पहचान करें',
      identify_description: 'दवा की पहचान करने और विस्तृत जानकारी प्राप्त करने के लिए फोटो लें या छवि अपलोड करें',
      take_photo: 'फोटो लें',
      choose_from_gallery: 'गैलरी से चुनें',
      recent_predictions: 'हाल की भविष्यवाणियां',
      features: 'विशेषताएं',
      camera_integration: 'कैमरा एकीकरण',
      text_to_speech: 'टेक्स्ट टू स्पीच',
      multilingual_support: 'बहुभाषी समर्थन',
      medicine_database: 'दवा डेटाबेस',
      listen: 'सुनें',
      identified_medicine: 'पहचानी गई दवा',
      confidence: 'विश्वास',
      high_confidence: 'उच्च विश्वास',
      medium_confidence: 'मध्यम विश्वास',
      low_confidence: 'कम विश्वास',
      prediction_confidence: 'भविष्यवाणी विश्वास',
      medicine_details: 'दवा विवरण',
      scan_another: 'दूसरा स्कैन करें',
      back_to_home: 'होम पर वापस जाएं',
      listen_medicine: 'दवा सुनें',
      listen_details: 'विवरण सुनें',
      requesting_camera_permission: 'कैमरा अनुमति का अनुरोध कर रहे हैं...',
      camera_permission_denied: 'कैमरा अनुमति अस्वीकृत',
      grant_permission: 'अनुमति दें',
      position_medicine_here: 'दवा को यहां रखें',
      processing: 'प्रसंस्करण...',
      tap_to_capture: 'कैप्चर करने के लिए टैप करें',
      language_settings: 'भाषा सेटिंग्स',
      language_description: 'अपनी पसंदीदा भाषा चुनें',
      accessibility_settings: 'पहुंच सेटिंग्स',
      auto_speak_results: 'ऑटो स्पीक परिणाम',
      auto_speak_description: 'दवा पहचान परिणामों को स्वचालित रूप से बोलें',
      haptic_feedback: 'हैप्टिक फीडबैक',
      haptic_feedback_description: 'इंटरैक्शन पर कंपन',
      notifications: 'सूचनाएं',
      notifications_description: 'अपडेट के लिए सूचनाएं प्राप्त करें',
      speech_settings: 'भाषण सेटिंग्स',
      test_speech: 'भाषण परीक्षण',
      app_settings: 'ऐप सेटिंग्स',
      clear_cache: 'कैश साफ़ करें',
      clear_cache_confirmation: 'क्या आप वाकई कैश साफ़ करना चाहते हैं?',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      success: 'सफलता',
      cache_cleared: 'कैश सफलतापूर्वक साफ़ हो गया',
      about: 'के बारे में',
      app_version: 'ऐप संस्करण',
      developed_by: 'द्वारा विकसित',
      medicine_database_version: 'दवा डेटाबेस संस्करण',
      language_changed: 'भाषा सफलतापूर्वक बदल गई',
      speech_test_message: 'यह टेक्स्ट-टू-स्पीच कार्यक्षमता का परीक्षण है',
      purpose: 'उद्देश्य',
      dosage: 'खुराक',
      side_effects: 'साइड इफेक्ट्स',
      precautions: 'सावधानियां',
    },
  };

  const t = (key) => {
    return translations_data[currentLanguage]?.[key] || translations_data.en[key] || key;
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const result = await translateText(text, targetLanguage);
      return result.data;
    } catch (error) {
      console.error('Translation error:', error);
      return { translated_text: text };
    }
  };

  const value = {
    t,
    currentLanguage,
    changeLanguage,
    translateText,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
