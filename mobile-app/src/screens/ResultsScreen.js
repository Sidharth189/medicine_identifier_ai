import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  Divider,
  FAB,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeech } from '../hooks/useSpeech';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { prediction, imageUri } = route.params;
  const { t, currentLanguage, translateText } = useTranslation();
  const { speak, stopSpeaking } = useSpeech();
  const [translatedInfo, setTranslatedInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return t('high_confidence');
    if (confidence >= 0.6) return t('medium_confidence');
    return t('low_confidence');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        <View style={styles.imageInfo}>
          <Title style={styles.medicineName}>
            {prediction.predicted_medicine}
          </Title>
          <Chip
            style={[
              styles.confidenceChip,
              { backgroundColor: getConfidenceColor(prediction.confidence) }
            ]}
            textStyle={styles.confidenceText}
          >
            {Math.round(prediction.confidence * 100)}% {t('confidence')}
          </Chip>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.confidenceCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t('prediction_confidence')}</Title>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill,
                  { 
                    width: `${prediction.confidence * 100}%`,
                    backgroundColor: getConfidenceColor(prediction.confidence)
                  }
                ]} 
              />
            </View>
            <Text style={styles.confidenceDescription}>
              {getConfidenceText(prediction.confidence)}
            </Text>
          </Card.Content>
        </Card>

        {translatedInfo && (
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>{t('medicine_details')}</Title>
              
              {Object.entries(translatedInfo).map(([key, value], index) => (
                <View key={index}>
                  <Surface style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t(key)}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </Surface>
                  {index < Object.entries(translatedInfo).length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Camera')}
            style={styles.actionButton}
            icon="camera"
          >
            {t('scan_another')}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Home')}
            style={styles.actionButton}
            icon="home"
          >
            {t('back_to_home')}
          </Button>
        </View>
      </View>

      <FAB
        style={styles.fab}
        icon="volume-high"
        onPress={handleSpeakMedicine}
        label={t('listen_medicine')}
      />
      
      {translatedInfo && (
        <FAB
          style={[styles.fab, styles.fabDetails]}
          icon="information"
          onPress={handleSpeakDetails}
          label={t('listen_details')}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  confidenceChip: {
    alignSelf: 'flex-start',
  },
  confidenceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  confidenceCard: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsCard: {
    marginBottom: 20,
    elevation: 4,
  },
  detailItem: {
    padding: 16,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 80,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
  fabDetails: {
    bottom: 80,
  },
});
