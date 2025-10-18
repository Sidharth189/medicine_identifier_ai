import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { textToSpeech } from '../services/api';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const speak = async (text, language = 'en') => {
    try {
      // Stop any current speech
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
      }

      // Try to use the API first for better quality
      try {
        const result = await textToSpeech(text, language);
        if (result.success && result.data.audio_data) {
          // For now, fall back to expo-speech since we can't play base64 audio directly
          // In a production app, you'd decode and play the audio
          Speech.speak(text, {
            language: language,
            pitch: 1.0,
            rate: 0.8,
            onStart: () => setIsSpeaking(true),
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
          });
        } else {
          throw new Error('API TTS failed');
        }
      } catch (apiError) {
        console.log('API TTS failed, using expo-speech:', apiError);
        
        // Fallback to expo-speech
        Speech.speak(text, {
          language: language,
          pitch: 1.0,
          rate: 0.8,
          onStart: () => setIsSpeaking(true),
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
        });
      }
    } catch (error) {
      console.error('Speech error:', error);
      // Fallback to basic speech
      Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
  };

  const pauseSpeaking = () => {
    if (isSpeaking) {
      Speech.pause();
    }
  };

  const resumeSpeaking = () => {
    if (isSpeaking) {
      Speech.resume();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        Speech.stop();
      }
    };
  }, []);

  return {
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
  };
};
