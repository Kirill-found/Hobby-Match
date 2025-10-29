import { useState, useEffect } from 'react';
import { likesApi, type LikedUser } from '../api/likes';
import BottomNav from '../components/Layout/BottomNav';

export default function LikesPage() {
  const [likes, setLikes] = useState<LikedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await likesApi.getLikes();
      setLikes(data);
    } catch (err: any) {
      console.error('Error loading likes:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить лайки');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (userId: number) => {
    try {
      await likesApi.unlikeUser(userId);
      setLikes(likes.filter(like => like.user_id !== userId));
    } catch (err: any) {
      console.error('Error unliking user:', err);
      alert('Не удалось убрать лайк');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '88px' }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-500 text-base">Загружаем лайки...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '88px' }}>
        <div className="text-center px-6 max-w-md mx-auto">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Что-то пошло не так
          </h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={loadLikes}
            className="tinder-button"
          >
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      {/* Header - fixed at top */}
      <div
        className="sticky top-0 z-10 bg-white"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="mx-auto px-6 py-5" style={{ maxWidth: '480px' }}>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Мои лайки 💚
          </h1>
          {likes.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {likes.length} {likes.length === 1 ? 'человек' : likes.length < 5 ? 'человека' : 'людей'}
            </p>
          )}
        </div>
      </div>

      {/* Content area */}
      <div style={{ paddingBottom: '96px', minHeight: 'calc(100vh - 72px)' }}>
        {/* Empty state */}
        {likes.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 168px)' }}>
            <div className="text-center px-6 max-w-md mx-auto">
              <div className="text-7xl mb-6">💚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Пока нет лайков
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Начните листать карточки и лайкайте понравившихся людей для совместных хобби
              </p>
              <button
                onClick={() => window.location.href = '/discovery'}
                className="tinder-button"
              >
                Перейти к поиску
              </button>
            </div>
          </div>
        ) : (
          /* Grid of liked users */
          <div className="mx-auto px-4 py-6" style={{ maxWidth: '480px' }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {likes.map((like) => {
                const photoUrl = like.photos && like.photos.length > 0
                  ? like.photos[0]
                  : 'https://via.placeholder.com/300x400?text=No+Photo';

                return (
                  <div
                    key={like.user_id}
                    className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    style={{ aspectRatio: '3/4' }}
                  >
                    {/* Photo */}
                    <img
                      src={photoUrl}
                      alt={like.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                      }}
                    />

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="text-white font-bold text-base leading-tight truncate">
                              {like.name}
                            </h3>
                            {like.is_verified && (
                              <span className="text-blue-400 text-sm flex-shrink-0">✓</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-white text-sm">
                            {like.age && <span>{like.age} лет</span>}
                            {like.distance_km && (
                              <>
                                <span>•</span>
                                <span>{like.distance_km} км</span>
                              </>
                            )}
                          </div>
                          {/* Interests */}
                          {like.interests && like.interests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {like.interests.slice(0, 2).map((interest: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 rounded-full truncate"
                                  style={{
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white',
                                    maxWidth: '100px',
                                  }}
                                >
                                  {interest.icon} {interest.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Unlike button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Убрать лайк с ${like.name}?`)) {
                              handleUnlike(like.user_id);
                            }
                          }}
                          className="ml-2 flex-shrink-0 rounded-full p-2 transition-all hover:bg-white/30"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Green heart indicator */}
                    <div
                      className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(34, 197, 94, 0.95)',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>💚</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
