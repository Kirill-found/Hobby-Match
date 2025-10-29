import { useState } from 'react';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Temporary hardcoded interests until we fix the seed endpoint
const TEMP_INTERESTS = [
  { id: 1, name: 'Футбол', icon: '⚽', color: 'from-green-400 to-green-600' },
  { id: 2, name: 'Баскетбол', icon: '🏀', color: 'from-orange-400 to-orange-600' },
  { id: 3, name: 'Волейбол', icon: '🏐', color: 'from-blue-400 to-blue-600' },
  { id: 4, name: 'Теннис', icon: '🎾', color: 'from-yellow-400 to-yellow-600' },
  { id: 5, name: 'Бег', icon: '🏃', color: 'from-red-400 to-red-600' },
  { id: 6, name: 'Велоспорт', icon: '🚴', color: 'from-indigo-400 to-indigo-600' },
  { id: 7, name: 'Плавание', icon: '🏊', color: 'from-cyan-400 to-cyan-600' },
  { id: 8, name: 'Йога', icon: '🧘', color: 'from-purple-400 to-purple-600' },
  { id: 9, name: 'Фитнес', icon: '💪', color: 'from-red-500 to-pink-600' },
  { id: 10, name: 'Рисование', icon: '🎨', color: 'from-pink-400 to-rose-600' },
  { id: 11, name: 'Музыка', icon: '🎵', color: 'from-violet-400 to-purple-600' },
  { id: 12, name: 'Фотография', icon: '📸', color: 'from-gray-400 to-gray-600' },
  { id: 13, name: 'Танцы', icon: '💃', color: 'from-fuchsia-400 to-pink-600' },
  { id: 14, name: 'Видеоигры', icon: '🎮', color: 'from-blue-500 to-purple-600' },
  { id: 15, name: 'Настольные игры', icon: '🎲', color: 'from-amber-400 to-orange-600' },
  { id: 16, name: 'Шахматы', icon: '♟️', color: 'from-slate-400 to-slate-600' },
  { id: 17, name: 'Походы', icon: '🥾', color: 'from-emerald-400 to-green-600' },
  { id: 18, name: 'Программирование', icon: '💻', color: 'from-sky-400 to-blue-600' },
  { id: 19, name: 'Готовка', icon: '👨‍🍳', color: 'from-orange-400 to-red-600' },
  { id: 20, name: 'Путешествия', icon: '✈️', color: 'from-teal-400 to-cyan-600' },
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
    <form onSubmit={handleSubmit} className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center scale-in">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-telegram-text mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ваши интересы
        </h2>
        <p className="text-telegram-hint">
          Выберите минимум 3 интереса, чтобы находить подходящих партнеров
        </p>
      </div>

      {/* Interests grid */}
      <div className="grid grid-cols-2 gap-3">
        {TEMP_INTERESTS.map((interest, index) => {
          const isSelected = selectedInterests.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 slide-in-right ${
                isSelected
                  ? `bg-gradient-to-br ${interest.color} text-white shadow-lg`
                  : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`text-3xl mb-2 ${isSelected ? 'scale-110' : ''} transition-transform`}>
                {interest.icon}
              </div>
              <div className="font-medium text-sm">{interest.name}</div>
              {isSelected && (
                <div className="mt-2 text-xs opacity-90">✓ Выбрано</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      <div className={`text-center p-4 rounded-xl transition-all duration-300 ${
        selectedInterests.length >= 3
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700'
          : 'bg-telegram-secondaryBg text-telegram-hint'
      }`}>
        <div className="font-medium">
          Выбрано: {selectedInterests.length} {selectedInterests.length >= 3 ? '✅' : '(минимум 3)'}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-telegram-secondaryBg text-telegram-text py-4 rounded-xl font-semibold hover:bg-telegram-hint/10 transition-all duration-300 transform hover:scale-[1.02]"
        >
          ← Назад
        </button>
        <button
          type="submit"
          disabled={selectedInterests.length < 3}
          className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
            selectedInterests.length >= 3
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Далее →
        </button>
      </div>
    </form>
  );
}
