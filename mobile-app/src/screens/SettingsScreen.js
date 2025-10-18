import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Switch,
  List,
  Divider,
  Button,
  Surface,
  Text,
} from 'react-native-paper';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeech } from '../hooks/useSpeech';

export default function SettingsScreen() {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { speak, stopSpeaking } = useSpeech();
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
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
    Alert.alert(
      t('clear_cache'),
      t('clear_cache_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => {
          // Clear cache logic here
          Alert.alert(t('success'), t('cache_cleared'));
        }}
      ]
    );
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('language_settings')}</Title>
            <Paragraph style={styles.cardDescription}>
              {t('language_description')}
            </Paragraph>
            
            <View style={styles.languageGrid}>
              {languages.map((lang) => (
                <Surface
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === lang.code && styles.selectedLanguage
                  ]}
                >
                  <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={[
                      styles.languageName,
                      currentLanguage === lang.code && styles.selectedLanguageText
                    ]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                </Surface>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('accessibility_settings')}</Title>
            
            <List.Item
              title={t('auto_speak_results')}
              description={t('auto_speak_description')}
              right={() => (
                <Switch
                  value={autoSpeak}
                  onValueChange={setAutoSpeak}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title={t('haptic_feedback')}
              description={t('haptic_feedback_description')}
              right={() => (
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title={t('notifications')}
              description={t('notifications_description')}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('speech_settings')}</Title>
            
            <Button
              mode="outlined"
              onPress={handleTestSpeech}
              style={styles.testButton}
              icon="volume-high"
            >
              {t('test_speech')}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('app_settings')}</Title>
            
            <Button
              mode="outlined"
              onPress={handleClearCache}
              style={styles.actionButton}
              icon="delete"
            >
              {t('clear_cache')}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('about')}</Title>
            <Paragraph style={styles.aboutText}>
              {t('app_version')}: 1.0.0
            </Paragraph>
            <Paragraph style={styles.aboutText}>
              {t('developed_by')}: AI Assistant
            </Paragraph>
            <Paragraph style={styles.aboutText}>
              {t('medicine_database_version')}: 1.0
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageOption: {
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#6366f1',
  },
  languageButton: {
    alignItems: 'center',
    padding: 8,
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  languageName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#374151',
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  testButton: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});
