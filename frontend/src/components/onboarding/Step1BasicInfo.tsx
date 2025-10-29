interface Step1Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!data.first_name || !data.age || !data.gender) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (data.age < 18 || data.age > 100) {
      alert('Возраст должен быть от 18 до 100 лет');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 fade-in">
      {/* Header with icon */}
      <div className="text-center scale-in">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-3xl font-bold text-telegram-text mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Расскажите о себе
        </h2>
        <p className="text-telegram-hint">
          Основная информация для вашего профиля
        </p>
      </div>

      {/* First Name */}
      <div className="slide-in-right" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-telegram-text mb-2 flex items-center gap-2">
          <span className="text-xl">✨</span>
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.first_name}
          onChange={(e) => onChange({ first_name: e.target.value })}
          placeholder="Ваше имя"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-xl border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
          required
        />
      </div>

      {/* Last Name */}
      <div className="slide-in-right" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-telegram-text mb-2 flex items-center gap-2">
          <span className="text-xl">👤</span>
          Фамилия
        </label>
        <input
          type="text"
          value={data.last_name}
          onChange={(e) => onChange({ last_name: e.target.value })}
          placeholder="Ваша фамилия (необязательно)"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-xl border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
        />
      </div>

      {/* Age */}
      <div className="slide-in-right" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-telegram-text mb-2 flex items-center gap-2">
          <span className="text-xl">🎂</span>
          Возраст <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.age}
          onChange={(e) => onChange({ age: parseInt(e.target.value) })}
          placeholder="18"
          min="18"
          max="100"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-xl border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
          required
        />
      </div>

      {/* Gender */}
      <div className="slide-in-right" style={{ animationDelay: '0.4s' }}>
        <label className="block text-sm font-medium text-telegram-text mb-3 flex items-center gap-2">
          <span className="text-xl">⚧️</span>
          Пол <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ gender: 'male' })}
            className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              data.gender === 'male'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            <span className="text-2xl mr-2">👨</span>
            Мужской
          </button>
          <button
            type="button"
            onClick={() => onChange({ gender: 'female' })}
            className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              data.gender === 'female'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/50'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            <span className="text-2xl mr-2">👩</span>
            Женский
          </button>
        </div>
      </div>

      {/* City */}
      <div className="slide-in-right" style={{ animationDelay: '0.5s' }}>
        <label className="block text-sm font-medium text-telegram-text mb-2 flex items-center gap-2">
          <span className="text-xl">📍</span>
          Город
        </label>
        <input
          type="text"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Москва"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-xl border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transform hover:scale-[1.02] transition-all duration-300 slide-in-right"
        style={{ animationDelay: '0.6s' }}
      >
        Далее →
      </button>
    </form>
  );
}
