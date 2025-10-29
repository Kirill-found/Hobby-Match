import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { authApi } from '../api/auth';
import { locationApi } from '../api/location';

// Onboarding steps
import Step1BasicInfo from '../components/onboarding/Step1BasicInfo';
import Step2AboutMe from '../components/onboarding/Step2AboutMe';
import Step3InterestsNew from '../components/onboarding/Step3InterestsNew';
import Step4Preferences from '../components/onboarding/Step4Preferences';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();

  // Redirect to discovery if onboarding already completed
  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate('/discovery', { replace: true });
    }
  }, [user, navigate]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    age: user?.age || 18,
    gender: user?.gender || '',
    bio: user?.bio || '',
    city: user?.city || '',
    latitude: user?.latitude || null,
    longitude: user?.longitude || null,
    photos: user?.photos || [],
    interests: [],
    partner_gender_preference: 'any',
    max_distance_km: 10,
    min_age: 18,
    max_age: 35,
  });

  const [requestingLocation, setRequestingLocation] = useState(false);

  const totalSteps = 4;

  const handleNext = async () => {
    // Request geolocation after step 1 (basic info)
    if (currentStep === 1 && !formData.latitude && !formData.longitude) {
      await requestGeolocation();
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const requestGeolocation = async () => {
    setRequestingLocation(true);
    try {
      const position = await locationApi.requestBrowserLocation();
      const { latitude, longitude } = position.coords;

      // Update form data with coordinates
      setFormData(prev => ({
        ...prev,
        latitude,
        longitude,
      }));

      console.log('Location obtained:', { latitude, longitude });
    } catch (error) {
      console.error('Geolocation error:', error);
      // Don't block onboarding if location fails
      // User can continue without location
    } finally {
      setRequestingLocation(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  const handleComplete = async () => {
    try {
      console.log('Saving profile with data:', formData);

      // Prepare profile data (exclude photos and interests - they're handled separately)
      const { photos, interests, latitude, longitude, ...profileData } = formData;

      // First, update the profile with basic data
      const updatedUser = await authApi.updateProfile(profileData);
      console.log('Profile updated successfully:', updatedUser);

      // Save location if available
      if (latitude && longitude) {
        try {
          await locationApi.updateLocation({
            latitude,
            longitude,
            city: formData.city || undefined,
          });
          console.log('Location saved:', { latitude, longitude });
        } catch (error) {
          console.error('Failed to save location:', error);
          // Don't block onboarding if location save fails
        }
      }

      // Save interests to backend
      if (interests && Array.isArray(interests) && interests.length > 0) {
        try {
          // Save each interest with skill level
          for (const interest of interests as any[]) {
            try {
              await fetch(`${import.meta.env.VITE_API_URL}/interests/user/interests`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  category_id: interest.category_id,
                  skill_level: interest.skill_level,
                  want_to_try: interest.want_to_try || false,
                }),
              });
            } catch (err) {
              console.error('Failed to save interest:', interest, err);
            }
          }
          console.log('Interests saved successfully');
        } catch (error) {
          console.error('Failed to save interests:', error);
          // Don't block onboarding if interests save fails
        }
      }

      // Then mark onboarding as completed
      const result = await authApi.completeOnboarding();
      console.log('Onboarding completed:', result);

      // Update local state (exclude null values)
      const updateData: any = { ...formData, onboarding_completed: true };
      if (updateData.latitude === null) delete updateData.latitude;
      if (updateData.longitude === null) delete updateData.longitude;
      updateUser(updateData);

      // Navigate to discovery
      navigate('/discovery');
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage = error.response?.data?.detail || 'Не удалось сохранить профиль. Попробуйте еще раз.';
      alert(errorMessage);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={formData} onChange={handleDataChange} onNext={handleNext} />;
      case 2:
        return <Step2AboutMe data={formData} onChange={handleDataChange} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3InterestsNew data={formData} onChange={handleDataChange} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4Preferences data={formData} onChange={handleDataChange} onComplete={handleComplete} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      {/* Progress indicator - Modern style */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {renderStep()}
        </div>
      </div>

      {/* Location request overlay */}
      {requestingLocation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ fontSize: '60px', animation: 'pulse 1.5s ease-in-out infinite' }}>
            📍
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', textAlign: 'center', padding: '0 20px' }}>
            Определяем ваше местоположение...
          </div>
          <div style={{ color: '#CCCCCC', fontSize: '14px', textAlign: 'center', padding: '0 20px', maxWidth: '400px' }}>
            Это поможет нам показывать людей рядом с вами
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
