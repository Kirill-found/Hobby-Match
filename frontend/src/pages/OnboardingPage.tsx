import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { authApi } from '../api/auth';

// Onboarding steps
import Step1BasicInfo from '../components/onboarding/Step1BasicInfo';
import Step2AboutMe from '../components/onboarding/Step2AboutMe';
import Step3Interests from '../components/onboarding/Step3Interests';
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
    photos: user?.photos || [],
    interests: [],
    partner_gender_preference: 'any',
    max_distance_km: 10,
    min_age: 18,
    max_age: 35,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
      // First, update the profile with all form data
      await authApi.updateProfile(formData);

      // Then mark onboarding as completed
      await authApi.completeOnboarding();

      // Update local state
      updateUser({ ...formData, onboarding_completed: true });

      // Navigate to discovery
      navigate('/discovery');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      alert('Не удалось сохранить профиль. Попробуйте еще раз.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={formData} onChange={handleDataChange} onNext={handleNext} />;
      case 2:
        return <Step2AboutMe data={formData} onChange={handleDataChange} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3Interests data={formData} onChange={handleDataChange} onNext={handleNext} onBack={handleBack} />;
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
    </div>
  );
}
