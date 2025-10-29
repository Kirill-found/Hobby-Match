import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import UserCard from '../components/UserCard';
import { discoveryApi } from '../api/discovery';
import type { DiscoveryUser, DiscoveryFilters } from '../api/discovery';
import { interestsApi } from '../api/interests';
import type { InterestCategory } from '../api/interests';
import BottomNav from '../components/Layout/BottomNav';
import FilterModal from '../components/FilterModal';

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [users, setUsers] = useState<DiscoveryUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [interests, setInterests] = useState<InterestCategory[]>([]);
  const [filters, setFilters] = useState<DiscoveryFilters>({
    minAge: 18,
    maxAge: 60,
    maxDistance: 50,
    selectedInterests: [],
  });

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (user && !user.onboarding_completed) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Load discovery users on mount
  useEffect(() => {
    loadUsers();
    loadInterests();
  }, []);

  const loadUsers = async (appliedFilters?: DiscoveryFilters) => {
    try {
      setLoading(true);
      setError(null);
      const discoveryUsers = await discoveryApi.getUsers(20, appliedFilters);
      setUsers(discoveryUsers);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error('Error loading discovery users:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const loadInterests = async () => {
    try {
      // Load all interest categories for filter
      const categories = await interestsApi.getCategories();
      setInterests(categories);
    } catch (err) {
      console.error('Error loading interests:', err);
    }
  };

  const handleApplyFilters = (newFilters: DiscoveryFilters) => {
    setFilters(newFilters);
    loadUsers(newFilters);
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
        style={{ backgroundColor: '#0F0F0F' }}
      >
        <div className="text-center px-6">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Загружаем пользователей...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0F0F0F' }}
      >
        <div className="text-center px-6">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Что-то пошло не так
          </h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={() => loadUsers()}
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
        style={{ backgroundColor: '#0F0F0F' }}
      >
        <div className="text-center px-6">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Вы посмотрели всех!
          </h2>
          <p className="text-gray-400 mb-8">
            Новые пользователи появятся совсем скоро
          </p>
          <button
            onClick={async () => {
              try {
                const result = await discoveryApi.resetSwipes();
                alert(result.message);
                await loadUsers();
              } catch (err) {
                console.error('Error resetting swipes:', err);
                alert('Не удалось сбросить свайпы');
              }
            }}
            className="tinder-button"
          >
            Обновить ленту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#0F0F0F', paddingTop: '72px', paddingBottom: '88px' }}
    >
      {/* Match Notification */}
      {showMatchNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <div className="text-7xl mb-4">🤝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Взаимный интерес!
            </h2>
            <p className="text-gray-500">
              Вы оба хотите заниматься хобби вместе. Начните общение!
            </p>
          </div>
        </div>
      )}

      {/* Filter Button - Fixed at Top Right */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setShowFilterModal(true)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V19L10 21V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Card Container */}
      <div className="max-w-md mx-auto px-4">
        <div className="fade-in">
          <UserCard
            user={currentUser}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>
      </div>

      <BottomNav />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        interests={interests.map(cat => ({ id: cat.id, name: cat.name, icon: cat.icon || '🎯' }))}
      />
    </div>
  );
}
