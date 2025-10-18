import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Volume2, Globe, Settings, Info, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';
import { useSpeech } from '../hooks/useSpeech';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.div`
  display: flex;
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
  margin-right: 20px;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const Content = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

const CardDescription = styled.p`
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#6366f1' : '#e5e7eb'};
  background: ${props => props.selected ? '#f0f9ff' : 'white'};
  color: ${props => props.selected ? '#6366f1' : '#374151'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #6366f1;
    background: #f0f9ff;
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.5rem;
`;

const LanguageName = styled.span`
  font-size: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingTitle = styled.h3`
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SettingDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #6366f1;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #6366f1;
  background: white;
  color: #6366f1;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    background: #6366f1;
    color: white;
  }
`;

const AboutText = styled.p`
  color: #6b7280;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { speak } = useSpeech();
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    const message = t('language_changed');
    speak(message, language);
  };

  const handleTestSpeech = () => {
    const testMessage = t('speech_test_message');
    speak(testMessage, currentLanguage);
  };

  const handleClearCache = () => {
    if (window.confirm(t('clear_cache_confirmation'))) {
      // Clear cache logic here
      localStorage.clear();
      toast.success(t('cache_cleared'));
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </BackButton>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('language_settings')}</h1>
      </Header>

      <Content>
        <Card>
          <CardTitle>
            <Globe size={24} />
            {t('language_settings')}
          </CardTitle>
          <CardDescription>{t('language_description')}</CardDescription>
          
          <LanguageGrid>
            {languages.map((lang) => (
              <LanguageButton
                key={lang.code}
                selected={currentLanguage === lang.code}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <LanguageFlag>{lang.flag}</LanguageFlag>
                <LanguageName>{lang.name}</LanguageName>
              </LanguageButton>
            ))}
          </LanguageGrid>
        </Card>

        <Card>
          <CardTitle>
            <Settings size={24} />
            {t('accessibility_settings')}
          </CardTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingTitle>{t('auto_speak_results')}</SettingTitle>
              <SettingDescription>{t('auto_speak_description')}</SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingTitle>{t('notifications')}</SettingTitle>
              <SettingDescription>{t('notifications_description')}</SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingItem>
        </Card>

        <Card>
          <CardTitle>
            <Volume2 size={24} />
            {t('speech_settings')}
          </CardTitle>
          
          <Button onClick={handleTestSpeech}>
            <Volume2 size={20} />
            {t('test_speech')}
          </Button>
        </Card>

        <Card>
          <CardTitle>
            <Settings size={24} />
            {t('app_settings')}
          </CardTitle>
          
          <Button onClick={handleClearCache}>
            <Trash2 size={20} />
            {t('clear_cache')}
          </Button>
        </Card>

        <Card>
          <CardTitle>
            <Info size={24} />
            {t('about')}
          </CardTitle>
          <AboutText>{t('app_version')}: 1.0.0</AboutText>
          <AboutText>{t('developed_by')}: AI Assistant</AboutText>
          <AboutText>{t('medicine_database_version')}: 1.0</AboutText>
        </Card>
      </Content>
    </Container>
  );
}
