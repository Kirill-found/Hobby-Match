import { useState } from 'react';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Temporary hardcoded interests until we fix the seed endpoint
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-telegram-text mb-2">
          Ваши интересы
        </h2>
        <p className="text-telegram-hint">
          Выберите минимум 3 интереса, чтобы находить подходящих партнеров
        </p>
      </div>

      {/* Interests grid */}
      <div className="grid grid-cols-2 gap-3">
        {TEMP_INTERESTS.map((interest) => (
          <button
            key={interest.id}
            type="button"
            onClick={() => toggleInterest(interest.id)}
            className={`p-4 rounded-lg text-left transition ${
              selectedInterests.includes(interest.id)
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            <div className="text-2xl mb-1">{interest.icon}</div>
            <div className="font-medium text-sm">{interest.name}</div>
          </button>
        ))}
      </div>

      {/* Selected count */}
      <div className="text-center text-sm text-telegram-hint">
        Выбрано: {selectedInterests.length} {selectedInterests.length >= 3 ? '✓' : '(минимум 3)'}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-telegram-secondaryBg text-telegram-text py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Назад
        </button>
        <button
          type="submit"
          className="flex-1 bg-telegram-button text-telegram-buttonText py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Далее
        </button>
      </div>
    </form>
  );
}
