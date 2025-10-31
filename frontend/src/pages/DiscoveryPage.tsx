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
import { Button } from '../components/common';

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

  useEffect(() => {
    if (user && !user.onboarding_completed) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

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
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setUsers([]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center px-6">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-base font-medium" style={{ color: '#B4B4C8' }}>
            Загружаем профили...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: '#FFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Что-то пошло не так
          </h2>
          <p className="text-base mb-6" style={{ color: '#B4B4C8' }}>
            {error}
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={() => loadUsers()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  // No more users state
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: '#FFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Вы посмотрели всех!
          </h2>
          <p className="text-base mb-6" style={{ color: '#B4B4C8' }}>
            Новые пользователи появятся совсем скоро
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
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
          >
            Обновить ленту
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        backgroundColor: '#0D1117',
      }}
    >
      {/* Compact top bar - NO TITLE */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
            color: '#0D1117',
            boxShadow: '0 4px 12px rgba(191, 255, 0, 0.25)',
          }}
          onClick={() => navigate('/profile')}
        >
          {user?.first_name ? user.first_name[0].toUpperCase() : '👤'}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(191, 255, 0, 0.3)',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="1.5">
            <path
              d="M3 4h18M3 4v2.586a1 1 0 00.293.707l6.414 6.414a1 1 0 01.293.707V19l4 2v-6.586a1 1 0 01.293-.707l6.414-6.414A1 1 0 0021 6.586V4M3 4h18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Match Notification */}
      {showMatchNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <div
            className="text-center p-8 rounded-3xl max-w-sm"
            style={{
              backgroundColor: '#161B22',
              boxShadow: '0 20px 60px rgba(191, 255, 0, 0.3)',
            }}
          >
            <div className="text-7xl mb-4">🤝</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                color: '#FFF',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Взаимный интерес!
            </h2>
            <p className="text-base" style={{ color: '#B4B4C8' }}>
              Вы оба хотите заниматься хобби вместе. Начните общение!
            </p>
          </div>
        </div>
      )}

      {/* Card Container - centered and responsive */}
      <div className="w-full px-3 pt-16 max-w-md mx-auto sm:px-4 md:max-w-lg lg:max-w-xl">
        <div key={currentUser.user_id}>
          <UserCard user={currentUser} onLike={handleLike} onDislike={handleDislike} />
        </div>
      </div>

      <BottomNav />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        interests={interests.map((cat) => ({ id: cat.id, name: cat.name, icon: cat.icon || '🎯' }))}
      />
    </div>
  );
}
