import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.4:8000'; // Replace with your computer's IP address

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictMedicine = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'medicine.jpg',
    });

    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Network error occurred',
    };
  }
};

export const getMedicineInfo = async (medicineName) => {
  try {
    const response = await api.get(`/medicine/${encodeURIComponent(medicineName)}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch medicine info',
    };
  }
};

export const getAllMedicines = async () => {
  try {
    const response = await api.get('/medicines');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch medicines list',
    };
  }
};

export const textToSpeech = async (text, language = 'en') => {
  try {
    const response = await api.post('/text-to-speech', null, {
      params: { text, language },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('TTS Error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to generate speech',
    };
  }
};

export const translateText = async (text, targetLanguage = 'en') => {
  try {
    const response = await api.post('/translate', null, {
      params: { text, target_language: targetLanguage },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Translation Error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to translate text',
    };
  }
};
