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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F8FA' }}
      >
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-500">Загружаем лайки...</p>
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
            onClick={loadLikes}
            className="tinder-button"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F7F8FA', paddingBottom: '80px' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Мои лайки 💚
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {likes.length} {likes.length === 1 ? 'человек' : 'людей'}
        </p>
      </div>

      {/* Empty state */}
      {likes.length === 0 ? (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <div className="text-center px-6">
            <div className="text-7xl mb-6">💚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Пока нет лайков
            </h2>
            <p className="text-gray-500 mb-8">
              Начните листать карточки и лайкайте понравившихся людей
            </p>
          </div>
        </div>
      ) : (
        /* Grid of liked users */
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {likes.map((like) => {
              const photoUrl = like.photos && like.photos.length > 0
                ? like.photos[0]
                : 'https://via.placeholder.com/300x400?text=No+Photo';

              return (
                <div
                  key={like.user_id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
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
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    }}
                  />

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-lg leading-tight">
                            {like.name}
                          </h3>
                          {like.is_verified && (
                            <span className="text-blue-400 text-sm">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm">
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
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  color: 'white',
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
                        className="ml-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
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
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.9)',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <span className="text-white text-lg">💚</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
