import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();

  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate('/discovery');
    }
  }, [user, navigate]);

  const handleComplete = () => {
    // TODO: Complete onboarding API call
    updateUser({ onboarding_completed: true });
    navigate('/discovery');
  };

  return (
    <div className="min-h-screen bg-telegram-bg p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-telegram-text mb-6">
          Добро пожаловать в HobbyMatch! 👋
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-telegram-text">
            Найди партнера для твоего хобби или спорта через знакомства по интересам.
          </p>

          <div className="bg-telegram-secondaryBg p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Как это работает:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Заполни профиль и выбери интересы</li>
              <li>Свайпай карточки других пользователей</li>
              <li>При взаимной симпатии - мэтч!</li>
              <li>Договаривайтесь о встрече в чате</li>
            </ol>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full bg-telegram-button text-telegram-buttonText py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Начать
        </button>
      </div>
    </div>
  );
}
