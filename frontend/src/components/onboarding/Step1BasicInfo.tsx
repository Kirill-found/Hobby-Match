interface Step1Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      {/* Header - Tinder style */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Создай профиль
        </h1>
        <p className="text-lg text-gray-500">
          Расскажи немного о себе
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Имя
          </label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => onChange({ first_name: e.target.value })}
            placeholder="Введите имя"
            className="tinder-input"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Возраст
          </label>
          <input
            type="number"
            value={data.age}
            onChange={(e) => onChange({ age: parseInt(e.target.value) })}
            placeholder="18"
            min="18"
            max="100"
            className="tinder-input"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Я
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ gender: 'female' })}
              className={`gender-button ${data.gender === 'female' ? 'selected' : ''}`}
            >
              <span className="text-2xl">👩</span>
              <span>Женщина</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ gender: 'male' })}
              className={`gender-button ${data.gender === 'male' ? 'selected' : ''}`}
            >
              <span className="text-2xl">👨</span>
              <span>Мужчина</span>
            </button>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Город
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Москва"
            className="tinder-input"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="tinder-button w-full"
      >
        Продолжить
      </button>
    </form>
  );
}
