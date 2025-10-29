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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-telegram-text mb-2">
          Предпочтения поиска
        </h2>
        <p className="text-telegram-hint">
          Настройте параметры поиска партнеров
        </p>
      </div>

      {/* Gender preference */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-3">
          Кого ищете?
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'male' })}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              data.partner_gender_preference === 'male'
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            Мужчин
          </button>
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'female' })}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              data.partner_gender_preference === 'female'
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            Женщин
          </button>
          <button
            type="button"
            onClick={() => onChange({ partner_gender_preference: 'any' })}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              data.partner_gender_preference === 'any'
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            Всех
          </button>
        </div>
      </div>

      {/* Age range */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-3">
          Возраст: {data.min_age} - {data.max_age} лет
        </label>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-telegram-hint mb-2">
              <span>От</span>
              <span>{data.min_age} лет</span>
            </div>
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
              className="w-full h-2 bg-telegram-secondaryBg rounded-lg appearance-none cursor-pointer accent-telegram-button"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm text-telegram-hint mb-2">
              <span>До</span>
              <span>{data.max_age} лет</span>
            </div>
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
              className="w-full h-2 bg-telegram-secondaryBg rounded-lg appearance-none cursor-pointer accent-telegram-button"
            />
          </div>
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-3">
          Максимальное расстояние: {data.max_distance_km} км
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={data.max_distance_km}
          onChange={(e) => onChange({ max_distance_km: parseInt(e.target.value) })}
          className="w-full h-2 bg-telegram-secondaryBg rounded-lg appearance-none cursor-pointer accent-telegram-button"
        />
        <div className="flex justify-between text-xs text-telegram-hint mt-2">
          <span>1 км</span>
          <span>50 км</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-telegram-secondaryBg p-4 rounded-lg">
        <p className="text-sm text-telegram-hint">
          Вы всегда сможете изменить эти настройки в профиле
        </p>
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
          Завершить
        </button>
      </div>
    </form>
  );
}
