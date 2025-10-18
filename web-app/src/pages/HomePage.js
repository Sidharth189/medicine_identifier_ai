import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, Upload, Volume2, Globe, Pill, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';
import { useSpeech } from '../hooks/useSpeech';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding-top: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
`;

const LanguageSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const LanguageButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.selected ? 'white' : 'rgba(255,255,255,0.5)'};
  background: ${props => props.selected ? 'white' : 'transparent'};
  color: ${props => props.selected ? '#6366f1' : 'white'};
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #6366f1;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 16px;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  color: #1f2937;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
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

export default function HomePage() {
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { speak } = useSpeech();
  const [loading, setLoading] = useState(false);

  const handleCameraClick = () => {
    navigate('/camera');
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        try {
          const { predictMedicine } = await import('../services/api');
          const result = await predictMedicine(file);
          
          if (result.success) {
            navigate('/results', { 
              state: { 
                prediction: result.data,
                imageFile: file 
              } 
            });
          } else {
            toast.error(result.error || 'Failed to identify medicine');
          }
        } catch (error) {
          toast.error('An error occurred while processing the image');
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  const handleSpeakWelcome = () => {
    const welcomeText = t('app_description');
    speak(welcomeText, currentLanguage);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <Container>
      <Header>
        <Title>{t('app_title')}</Title>
        <Subtitle>{t('app_description')}</Subtitle>
        
        <LanguageSelector>
          {languages.map((lang) => (
            <LanguageButton
              key={lang.code}
              selected={currentLanguage === lang.code}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.flag} {lang.name}
            </LanguageButton>
          ))}
        </LanguageSelector>
      </Header>

      <Content>
        <Card>
          <CardTitle>{t('identify_medicine')}</CardTitle>
          <CardDescription>{t('identify_description')}</CardDescription>
          
          <ButtonContainer>
            <Button primary onClick={handleCameraClick} disabled={loading}>
              <Camera size={24} />
              {t('take_photo')}
            </Button>
            
            <Button onClick={handleUploadClick} disabled={loading}>
              <Upload size={24} />
              {t('choose_from_gallery')}
            </Button>
          </ButtonContainer>
        </Card>

        <Card>
          <CardTitle>{t('features')}</CardTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>{t('camera_integration')}</FeatureTitle>
              <FeatureDescription>Take photos directly or upload from your device</FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔊</FeatureIcon>
              <FeatureTitle>{t('text_to_speech')}</FeatureTitle>
              <FeatureDescription>Listen to medicine information in multiple languages</FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🌍</FeatureIcon>
              <FeatureTitle>{t('multilingual_support')}</FeatureTitle>
              <FeatureDescription>Available in 12+ languages with real-time translation</FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💊</FeatureIcon>
              <FeatureTitle>{t('medicine_database')}</FeatureTitle>
              <FeatureDescription>Comprehensive database with detailed medicine information</FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Card>
      </Content>

      <FloatingButton onClick={handleSpeakWelcome} title={t('listen')}>
        <Volume2 size={24} />
      </FloatingButton>
    </Container>
  );
}
