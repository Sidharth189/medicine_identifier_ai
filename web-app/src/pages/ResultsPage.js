import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Camera, Home, Volume2, Info, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';
import { useSpeech } from '../hooks/useSpeech';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.1);
  color: white;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const Content = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

const MedicineImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 30px;
  color: white;
`;

const MedicineName = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 12px;
`;

const ConfidenceChip = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  background: ${props => {
    if (props.confidence >= 0.8) return '#10b981';
    if (props.confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  }};
  color: white;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ConfidenceBar = styled.div`
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.confidence >= 0.8) return '#10b981';
    if (props.confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  }};
  width: ${props => props.confidence * 100}%;
  transition: width 0.3s ease;
`;

const ConfidenceText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

const DetailItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.h3`
  font-size: 1rem;
  color: #6366f1;
  margin-bottom: 8px;
  font-weight: 600;
`;

const DetailValue = styled.p`
  font-size: 1.1rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  justify-content: center;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
    }
  ` : `
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
    
    &:hover {
      background: #6366f1;
      color: white;
      transform: translateY(-2px);
    }
  `}
`;

const FloatingButtons = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FloatingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
  }
`;

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage, translateText } = useTranslation();
  const { speak } = useSpeech();
  const [translatedInfo, setTranslatedInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const { prediction, imageFile, imageUrl } = location.state || {};

  useEffect(() => {
    if (!prediction) {
      navigate('/');
      return;
    }

    if (prediction.medicine_info) {
      translateMedicineInfo();
    }
  }, [currentLanguage]);

  const translateMedicineInfo = async () => {
    if (currentLanguage === 'en') {
      setTranslatedInfo(prediction.medicine_info);
      return;
    }

    try {
      setLoading(true);
      const translated = {};
      
      for (const [key, value] of Object.entries(prediction.medicine_info)) {
        const result = await translateText(value, currentLanguage);
        translated[key] = result.translated_text;
      }
      
      setTranslatedInfo(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedInfo(prediction.medicine_info);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakMedicine = () => {
    const medicineText = `${t('identified_medicine')}: ${prediction.predicted_medicine}. ${t('confidence')}: ${Math.round(prediction.confidence * 100)}%`;
    speak(medicineText, currentLanguage);
  };

  const handleSpeakDetails = () => {
    if (translatedInfo) {
      const detailsText = Object.entries(translatedInfo)
        .map(([key, value]) => `${t(key)}: ${value}`)
        .join('. ');
      speak(detailsText, currentLanguage);
    }
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return t('confidence_high');
    if (confidence >= 0.6) return t('confidence_medium');
    return t('confidence_low');
  };

  if (!prediction) {
    return null;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          {t('back_to_home')}
        </BackButton>
      </Header>

      <Content>
        <ImageContainer>
          <MedicineImage 
            src={imageUrl || URL.createObjectURL(imageFile)} 
            alt="Identified medicine" 
          />
          <ImageOverlay>
            <MedicineName>{prediction.predicted_medicine}</MedicineName>
            <ConfidenceChip confidence={prediction.confidence}>
              {Math.round(prediction.confidence * 100)}% {t('confidence')}
            </ConfidenceChip>
          </ImageOverlay>
        </ImageContainer>

        <Card>
          <CardTitle>
            <Info size={24} />
            {t('prediction_confidence')}
          </CardTitle>
          <ConfidenceBar>
            <ConfidenceFill confidence={prediction.confidence} />
          </ConfidenceBar>
          <ConfidenceText>
            {getConfidenceText(prediction.confidence)}
          </ConfidenceText>
        </Card>

        {translatedInfo && (
          <Card>
            <CardTitle>
              <Info size={24} />
              {t('medicine_details')}
            </CardTitle>
            
            {Object.entries(translatedInfo).map(([key, value], index) => (
              <DetailItem key={index}>
                <DetailLabel>{t(key)}</DetailLabel>
                <DetailValue>{value}</DetailValue>
              </DetailItem>
            ))}
          </Card>
        )}

        <ActionButtons>
          <ActionButton primary onClick={() => navigate('/camera')}>
            <Camera size={20} />
            {t('scan_another')}
          </ActionButton>
          
          <ActionButton onClick={() => navigate('/')}>
            <Home size={20} />
            {t('back_to_home')}
          </ActionButton>
        </ActionButtons>
      </Content>

      <FloatingButtons>
        <FloatingButton onClick={handleSpeakMedicine} title={t('listen_medicine')}>
          <Volume2 size={24} />
        </FloatingButton>
        
        {translatedInfo && (
          <FloatingButton onClick={handleSpeakDetails} title={t('listen_details')}>
            <Info size={24} />
          </FloatingButton>
        )}
      </FloatingButtons>
    </Container>
  );
}
