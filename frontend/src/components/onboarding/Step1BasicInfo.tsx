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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-telegram-text mb-2">
          Расскажите о себе
        </h2>
        <p className="text-telegram-hint">
          Основная информация для вашего профиля
        </p>
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.first_name}
          onChange={(e) => onChange({ first_name: e.target.value })}
          placeholder="Ваше имя"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Фамилия
        </label>
        <input
          type="text"
          value={data.last_name}
          onChange={(e) => onChange({ last_name: e.target.value })}
          placeholder="Ваша фамилия (необязательно)"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Возраст <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.age}
          onChange={(e) => onChange({ age: parseInt(e.target.value) })}
          placeholder="18"
          min="18"
          max="100"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Пол <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ gender: 'male' })}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              data.gender === 'male'
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            Мужской
          </button>
          <button
            type="button"
            onClick={() => onChange({ gender: 'female' })}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              data.gender === 'female'
                ? 'bg-telegram-button text-telegram-buttonText'
                : 'bg-telegram-secondaryBg text-telegram-text hover:bg-telegram-hint/10'
            }`}
          >
            Женский
          </button>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Город
        </label>
        <input
          type="text"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Москва"
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-telegram-button text-telegram-buttonText py-4 rounded-xl font-semibold hover:opacity-90 transition"
      >
        Далее
      </button>
    </form>
  );
}
