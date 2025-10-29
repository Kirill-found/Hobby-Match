import { useState } from 'react';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const TEMP_INTERESTS = [
  { id: 1, name: 'Футбол', icon: '⚽' },
  { id: 2, name: 'Баскетбол', icon: '🏀' },
  { id: 3, name: 'Волейбол', icon: '🏐' },
  { id: 4, name: 'Теннис', icon: '🎾' },
  { id: 5, name: 'Бег', icon: '🏃' },
  { id: 6, name: 'Велоспорт', icon: '🚴' },
  { id: 7, name: 'Плавание', icon: '🏊' },
  { id: 8, name: 'Йога', icon: '🧘' },
  { id: 9, name: 'Фитнес', icon: '💪' },
  { id: 10, name: 'Рисование', icon: '🎨' },
  { id: 11, name: 'Музыка', icon: '🎵' },
  { id: 12, name: 'Фотография', icon: '📸' },
  { id: 13, name: 'Танцы', icon: '💃' },
  { id: 14, name: 'Видеоигры', icon: '🎮' },
  { id: 15, name: 'Настольные игры', icon: '🎲' },
  { id: 16, name: 'Шахматы', icon: '♟️' },
  { id: 17, name: 'Походы', icon: '🥾' },
  { id: 18, name: 'Программирование', icon: '💻' },
  { id: 19, name: 'Готовка', icon: '👨‍🍳' },
  { id: 20, name: 'Путешествия', icon: '✈️' },
];

export default function Step3Interests({ data, onChange, onNext, onBack }: Step3Props) {
  const [selectedInterests, setSelectedInterests] = useState<number[]>(data.interests || []);

  const toggleInterest = (id: number) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Интересы
        </h1>
        <p className="text-lg text-gray-500">
          Выбери минимум 3, чтобы находить партнеров
        </p>
      </div>

      {/* Interests - Tinder style chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {TEMP_INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`interest-chip ${isSelected ? 'selected' : ''}`}
            >
              <span className="text-xl">{interest.icon}</span>
              <span>{interest.name}</span>
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
    </form>
  );
}
