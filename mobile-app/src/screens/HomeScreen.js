import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Text,
  Chip,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { predictMedicine } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeech } from '../hooks/useSpeech';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { speak, stopSpeaking } = useSpeech();
  const [loading, setLoading] = useState(false);
  const [recentPredictions, setRecentPredictions] = useState([]);

  const handleImagePicker = async (source) => {
    try {
      setLoading(true);
      
      let result;
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Media library permission is required to select images.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const prediction = await predictMedicine(imageUri);
        
        if (prediction.success) {
          setRecentPredictions(prev => [prediction.data, ...prev.slice(0, 4)]);
          navigation.navigate('Results', { 
            prediction: prediction.data,
            imageUri: imageUri 
          });
        } else {
          Alert.alert('Error', prediction.error || 'Failed to identify medicine');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Image picker error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakWelcome = () => {
    const welcomeText = t('welcome_message');
    speak(welcomeText, currentLanguage);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>{t('app_title')}</Title>
          <Paragraph style={styles.headerSubtitle}>
            {t('app_description')}
          </Paragraph>
          
          <View style={styles.languageSelector}>
            <Chip
              selected={currentLanguage === 'en'}
              onPress={() => changeLanguage('en')}
              style={styles.languageChip}
            >
              English
            </Chip>
            <Chip
              selected={currentLanguage === 'es'}
              onPress={() => changeLanguage('es')}
              style={styles.languageChip}
            >
              Español
            </Chip>
            <Chip
              selected={currentLanguage === 'hi'}
              onPress={() => changeLanguage('hi')}
              style={styles.languageChip}
            >
              हिन्दी
            </Chip>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.mainCard}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>{t('identify_medicine')}</Title>
            <Paragraph style={styles.cardDescription}>
              {t('identify_description')}
            </Paragraph>
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleImagePicker('camera')}
                loading={loading}
                disabled={loading}
                style={[styles.button, styles.cameraButton]}
                icon="camera"
                contentStyle={styles.buttonContent}
              >
                {t('take_photo')}
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => handleImagePicker('gallery')}
                loading={loading}
                disabled={loading}
                style={[styles.button, styles.galleryButton]}
                icon="image"
                contentStyle={styles.buttonContent}
              >
                {t('choose_from_gallery')}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {recentPredictions.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content>
              <Title style={styles.recentTitle}>{t('recent_predictions')}</Title>
              {recentPredictions.map((prediction, index) => (
                <Surface key={index} style={styles.recentItem}>
                  <Text style={styles.recentMedicine}>
                    {prediction.predicted_medicine}
                  </Text>
                  <Text style={styles.recentConfidence}>
                    {Math.round(prediction.confidence * 100)}% confidence
                  </Text>
                </Surface>
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.featuresCard}>
          <Card.Content>
            <Title style={styles.featuresTitle}>{t('features')}</Title>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>{t('camera_integration')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔊</Text>
                <Text style={styles.featureText}>{t('text_to_speech')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌍</Text>
                <Text style={styles.featureText}>{t('multilingual_support')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💊</Text>
                <Text style={styles.featureText}>{t('medicine_database')}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <FAB
        style={styles.fab}
        icon="volume-high"
        onPress={handleSpeakWelcome}
        label={t('listen')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  languageChip: {
    marginHorizontal: 4,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  mainCard: {
    marginBottom: 20,
    elevation: 4,
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 12,
  },
  cameraButton: {
    backgroundColor: '#6366f1',
  },
  galleryButton: {
    borderColor: '#6366f1',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  recentCard: {
    marginBottom: 20,
    elevation: 2,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recentItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentMedicine: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  recentConfidence: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  featuresCard: {
    marginBottom: 20,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});
