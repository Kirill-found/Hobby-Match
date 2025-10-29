import { useState, useEffect } from 'react';
import { interestsApi } from '../../api/interests';
import type { InterestCategory } from '../../api/interests';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface UserInterest {
  category_id: number;
  name: string;
  icon: string;
  skill_level: 'новичок' | 'любитель' | 'продвинутый' | 'профессионал' | null;
  want_to_try: boolean;
}

const SKILL_LEVELS = [
  { value: 'новичок', label: 'Новичок', icon: '🌱', color: '#4CAF50' },
  { value: 'любитель', label: 'Любитель', icon: '🌟', color: '#2196F3' },
  { value: 'продвинутый', label: 'Продвинутый', icon: '🔥', color: '#FF9800' },
  { value: 'профессионал', label: 'Профи', icon: '👑', color: '#9C27B0' },
];

export default function Step3InterestsNew({ data, onChange, onNext, onBack }: Step3Props) {
  const [interests, setInterests] = useState<InterestCategory[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<UserInterest[]>(data.interests || []);
  const [selectedForEdit, setSelectedForEdit] = useState<InterestCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const categories = await interestsApi.getCategories();
      setInterests(categories);
    } catch (error) {
      console.error('Failed to load interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInterestSelected = (categoryId: number) => {
    return selectedInterests.some(i => i.category_id === categoryId);
  };

  const getInterestDetails = (categoryId: number) => {
    return selectedInterests.find(i => i.category_id === categoryId);
  };

  const handleInterestClick = (interest: InterestCategory) => {
    if (isInterestSelected(interest.id)) {
      // Remove interest
      setSelectedInterests(selectedInterests.filter(i => i.category_id !== interest.id));
    } else {
      // Open skill level selector
      setSelectedForEdit(interest);
    }
  };

  const handleSkillLevelSelect = (skillLevel: string | null, wantToTry: boolean) => {
    if (!selectedForEdit) return;

    const newInterest: UserInterest = {
      category_id: selectedForEdit.id,
      name: selectedForEdit.name,
      icon: selectedForEdit.icon || '🎯',
      skill_level: skillLevel as any,
      want_to_try: wantToTry,
    };

    setSelectedInterests([...selectedInterests, newInterest]);
    setSelectedForEdit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedInterests.length < 3) {
      alert('Выберите хотя бы 3 интереса');
      return;
    }

    onChange({ interests: selectedInterests });
    onNext();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-5xl mb-4">⏳</div>
        <p className="text-gray-500">Загружаем интересы...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Интересы и хобби
        </h1>
        <p className="text-lg text-gray-500">
          Выбери минимум 3 и укажи свой уровень
        </p>
      </div>

      {/* Interests - Chips with skill level indicator */}
      <div className="flex flex-wrap gap-3 justify-center">
        {interests.slice(0, 30).map((interest) => {
          const isSelected = isInterestSelected(interest.id);
          const details = getInterestDetails(interest.id);
          const skillLevel = details ? SKILL_LEVELS.find(s => s.value === details.skill_level) : null;

          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => handleInterestClick(interest)}
              className={`interest-chip ${isSelected ? 'selected' : ''}`}
              style={{
                backgroundColor: isSelected && skillLevel ? skillLevel.color : undefined,
                border: isSelected && !skillLevel ? '2px solid #FD297B' : undefined,
              }}
            >
              <span className="text-xl">{interest.icon || '🎯'}</span>
              <span>{interest.name}</span>
              {isSelected && skillLevel && (
                <span className="text-sm ml-1">{skillLevel.icon}</span>
              )}
              {isSelected && details?.want_to_try && (
                <span className="text-sm ml-1">💭</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Counter */}
      <div className="text-center">
        <p className={`text-lg font-semibold ${
          selectedInterests.length >= 3 ? 'text-[#FD297B]' : 'text-gray-400'
        }`}>
          {selectedInterests.length >= 3
            ? `Выбрано ${selectedInterests.length} ✓`
            : `Выбрано ${selectedInterests.length} из 3`
          }
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="secondary-button flex-1"
        >
          Назад
        </button>
        <button
          type="submit"
          disabled={selectedInterests.length < 3}
          className="tinder-button flex-1"
        >
          Продолжить
        </button>
      </div>

      {/* Skill Level Selector Modal */}
      {selectedForEdit && (
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
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setSelectedForEdit(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '400px',
              padding: '24px',
              animation: 'scaleIn 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {selectedForEdit.icon || '🎯'}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>
                {selectedForEdit.name}
              </h3>
              <p style={{ color: '#666666', fontSize: '14px' }}>
                Какой у вас уровень?
              </p>
            </div>

            {/* Skill levels */}
            <div style={{ marginBottom: '16px' }}>
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleSkillLevelSelect(level.value, false)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: level.color,
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '20px' }}>{level.icon}</span>
                  <span>{level.label}</span>
                </button>
              ))}
            </div>

            {/* Want to try option */}
            <button
              type="button"
              onClick={() => handleSkillLevelSelect(null, true)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '2px dashed #FD297B',
                backgroundColor: 'transparent',
                color: '#FD297B',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '20px' }}>💭</span>
              <span>Хочу попробовать</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </form>
  );
}
