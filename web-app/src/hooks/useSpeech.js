import { useState } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text, language = 'en') => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const pauseSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.pause();
    }
  };

  const resumeSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.resume();
    }
  };

  return {
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
  };
};
