interface Step4Props {
  data: any;
  onChange: (data: any) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function Step4Preferences({ data, onChange, onComplete, onBack }: Step4Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Кого ищешь?
        </h1>
        <p className="text-lg text-gray-500">
          Настрой параметры поиска партнеров
        </p>
      </div>

      {/* Gender preference */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Пол партнера
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'male' })}
            className={`gender-button ${data.partner_gender_preference === 'male' ? 'selected' : ''}`}
          >
            <span className="text-xl">👨</span>
            <span className="text-sm">Мужчины</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'female' })}
            className={`gender-button ${data.partner_gender_preference === 'female' ? 'selected' : ''}`}
          >
            <span className="text-xl">👩</span>
            <span className="text-sm">Женщины</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'any' })}
            className={`gender-button ${data.partner_gender_preference === 'any' ? 'selected' : ''}`}
          >
            <span className="text-xl">👥</span>
            <span className="text-sm">Все</span>
          </button>
        </div>
      </div>

      {/* Age range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Возраст: {data.min_age} — {data.max_age} лет
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="18"
            max="60"
            value={data.min_age}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val < data.max_age) {
                onChange({ min_age: val });
              }
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6C63FF 0%, #6C63FF ${((data.min_age - 18) / (60 - 18)) * 100}%, #e0e0e0 ${((data.min_age - 18) / (60 - 18)) * 100}%, #e0e0e0 100%)`
            }}
          />
          <input
            type="range"
            min="18"
            max="60"
            value={data.max_age}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > data.min_age) {
                onChange({ max_age: val });
              }
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6C63FF 0%, #6C63FF ${((data.max_age - 18) / (60 - 18)) * 100}%, #e0e0e0 ${((data.max_age - 18) / (60 - 18)) * 100}%, #e0e0e0 100%)`
            }}
          />
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Расстояние: до {data.max_distance_km} км
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={data.max_distance_km}
          onChange={(e) => onChange({ max_distance_km: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6C63FF 0%, #6C63FF ${((data.max_distance_km - 1) / (50 - 1)) * 100}%, #e0e0e0 ${((data.max_distance_km - 1) / (50 - 1)) * 100}%, #e0e0e0 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>1 км</span>
          <span>50 км</span>
        </div>
      </div>

      {/* Info card */}
      <div className="tinder-card bg-gray-50 border-l-4 border-[#6C63FF]">
        <p className="text-sm text-gray-600">
          💡 Ты всегда сможешь изменить эти настройки в профиле
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
          className="tinder-button flex-1"
        >
          Завершить
        </button>
      </div>
    </form>
  );
}
