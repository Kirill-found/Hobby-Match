interface Step2Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2AboutMe({ data, onChange, onNext, onBack }: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.bio || data.bio.length < 10) {
      alert('Расскажите о себе хотя бы пару предложений (минимум 10 символов)');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          О себе
        </h1>
        <p className="text-lg text-gray-500">
          Расскажи, чем увлекаешься и что ищешь
        </p>
      </div>

      {/* Bio textarea */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Немного о себе
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Например: Люблю активный отдых, играю в волейбол по выходным. Ищу компанию для походов в горы!"
          rows={6}
          className="tinder-input resize-none"
          required
        />
        <div className="mt-2 text-sm text-gray-400">
          {data.bio.length} / 500 символов
        </div>
      </div>

      {/* Photo upload placeholder */}
      <div className="tinder-card text-center py-8">
        <div className="text-5xl mb-3">📸</div>
        <h3 className="font-semibold text-gray-700 mb-2">Добавь фото</h3>
        <p className="text-sm text-gray-500 mb-4">
          Фото помогут найти партнеров быстрее
        </p>
        <p className="text-xs text-gray-400">
          Загрузка фото будет доступна позже
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
          Продолжить
        </button>
      </div>
    </form>
  );
}
