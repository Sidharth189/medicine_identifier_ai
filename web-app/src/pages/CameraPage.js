import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, RotateCcw, Camera, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';
import { predictMedicine } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.7);
  color: white;
  position: relative;
  z-index: 10;
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

const SwitchButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const CameraContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas`
  display: none;
`;

const FocusFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border: 3px solid white;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const FocusText = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
`;

const Controls = styled.div`
  padding: 30px;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CaptureButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  background: ${props => props.loading ? '#666' : 'white'};
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const CaptureHint = styled.p`
  color: white;
  font-size: 1.1rem;
  text-align: center;
  margin: 0;
`;

const PreviewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const PreviewImage = styled.img`
  flex: 1;
  object-fit: contain;
  background: #000;
`;

const PreviewControls = styled.div`
  padding: 30px;
  background: rgba(0,0,0,0.8);
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const PreviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  ` : `
    background: #ef4444;
    color: white;
  `}

  &:hover {
    transform: translateY(-2px);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function CameraPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error(t('camera_permission_denied'));
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
      }, 'image/jpeg', 0.8);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const usePhoto = async () => {
    if (canvasRef.current) {
      setLoading(true);
      try {
        canvasRef.current.toBlob(async (blob) => {
          const file = new File([blob], 'medicine.jpg', { type: 'image/jpeg' });
          const result = await predictMedicine(file);
          
          if (result.success) {
            navigate('/results', { 
              state: { 
                prediction: result.data,
                imageFile: file,
                imageUrl: capturedImage
              } 
            });
          } else {
            toast.error(result.error || 'Failed to identify medicine');
            setCapturedImage(null);
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        toast.error('An error occurred while processing the image');
        setCapturedImage(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  if (loading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
        <h2>{t('processing')}</h2>
        <p>Analyzing medicine...</p>
      </LoadingOverlay>
    );
  }

  if (capturedImage) {
    return (
      <PreviewContainer>
        <PreviewImage src={capturedImage} alt="Captured medicine" />
        <PreviewControls>
          <PreviewButton onClick={retakePhoto}>
            <X size={20} />
            {t('retake_photo')}
          </PreviewButton>
          <PreviewButton primary onClick={usePhoto}>
            <Check size={20} />
            {t('use_photo')}
          </PreviewButton>
        </PreviewControls>
      </PreviewContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </BackButton>
        <SwitchButton onClick={switchCamera}>
          <RotateCcw size={20} />
        </SwitchButton>
      </Header>

      <CameraContainer>
        <Video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
        <Canvas ref={canvasRef} />
        <FocusFrame>
          <FocusText>{t('position_medicine_here')}</FocusText>
        </FocusFrame>
      </CameraContainer>

      <Controls>
        <CaptureButton onClick={capturePhoto} loading={loading}>
          <Camera size={32} />
        </CaptureButton>
        <CaptureHint>{t('tap_to_capture')}</CaptureHint>
      </Controls>
    </Container>
  );
}
