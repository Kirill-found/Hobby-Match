import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import UserCard from '../components/UserCard';
import { discoveryApi, type DiscoveryUser } from '../api/discovery';

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [users, setUsers] = useState<DiscoveryUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (user && !user.onboarding_completed) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Load discovery users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const discoveryUsers = await discoveryApi.getUsers(20);
      setUsers(discoveryUsers);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error('Error loading discovery users:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users[currentIndex];

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const response = await discoveryApi.swipe(currentUser.user_id, 'like');
      console.log('Liked user:', currentUser.user_id, response);

      if (response.matched) {
        setShowMatchNotification(true);
        setTimeout(() => setShowMatchNotification(false), 3000);
      }

      nextCard();
    } catch (err: any) {
      console.error('Error swiping:', err);
      // Показываем карточку дальше даже если была ошибка
      nextCard();
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return;

    try {
      await discoveryApi.swipe(currentUser.user_id, 'dislike');
      console.log('Disliked user:', currentUser.user_id);
      nextCard();
    } catch (err: any) {
      console.error('Error swiping:', err);
      // Показываем карточку дальше даже если была ошибка
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Больше нет карточек
      setUsers([]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F8FA' }}
      >
        <div className="text-center px-6">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-500">Загружаем пользователей...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F8FA' }}
      >
        <div className="text-center px-6">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Что-то пошло не так
          </h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={loadUsers}
            className="tinder-button"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // No more users
  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F8FA' }}
      >
        <div className="text-center px-6">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Вы посмотрели всех!
          </h2>
          <p className="text-gray-500 mb-8">
            Новые пользователи появятся совсем скоро
          </p>
          <button
            onClick={loadUsers}
            className="tinder-button"
          >
            Обновить список
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#F7F8FA' }}
    >
      {/* Match Notification */}
      {showMatchNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Это матч!
            </h2>
            <p className="text-gray-500">
              Вы понравились друг другу. Начните общение!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Поиск партнеров
          </h1>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {users.length}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="fade-in">
        <UserCard
          user={currentUser}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </div>

      {/* Hint */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <p className="text-sm text-gray-400">
          Свайпните влево, чтобы пропустить, или вправо, чтобы лайкнуть
        </p>
      </div>
    </div>
  );
}
