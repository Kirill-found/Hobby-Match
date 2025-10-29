interface Step2Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2AboutMe({ data, onChange, onNext, onBack }: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!data.bio || data.bio.length < 10) {
      alert('Расскажите о себе хотя бы пару предложений (минимум 10 символов)');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-telegram-text mb-2">
          О себе
        </h2>
        <p className="text-telegram-hint">
          Расскажите немного о себе, своих увлечениях и что ищете
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Био <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Расскажите о себе, чем увлекаетесь, чего ищете..."
          rows={6}
          className="w-full px-4 py-3 bg-telegram-secondaryBg text-telegram-text rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button resize-none"
          required
        />
        <div className="mt-1 text-sm text-telegram-hint">
          {data.bio.length} символов (минимум 10)
        </div>
      </div>

      {/* Photo upload placeholder */}
      <div>
        <label className="block text-sm font-medium text-telegram-text mb-2">
          Фото профиля
        </label>
        <div className="border-2 border-dashed border-telegram-hint/30 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-telegram-hint text-sm mb-4">
            Загрузка фото будет добавлена позже
          </p>
          <p className="text-telegram-hint text-xs">
            Пока можете пропустить этот шаг
          </p>
        </div>
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
