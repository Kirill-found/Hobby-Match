import { useState, useEffect } from 'react';
import { matchesApi, type MatchUser } from '../api/matches';
import BottomNav from '../components/Layout/BottomNav';

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchesApi.getMatches();
      setMatches(data);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить партнёров');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '80px' }}>
        <div className="text-center px-6">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-500">Загружаем партнёров...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '80px' }}>
        <div className="text-center px-6">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Что-то пошло не так</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button onClick={loadMatches} className="tinder-button">
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '80px' }}>
        <div className="text-center px-6">
          <div className="text-7xl mb-6">🤝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Пока нет партнёров</h2>
          <p className="text-gray-500 mb-8">
            Когда у вас будет взаимный интерес с кем-то, они появятся здесь
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA', paddingBottom: '80px' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Партнёры 🤝
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {matches.length} {matches.length === 1 ? 'человек' : 'людей'}
        </p>
      </div>

      {/* Matches Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {matches.map((match) => {
            const photoUrl = match.photos && match.photos.length > 0
              ? match.photos[0]
              : 'https://via.placeholder.com/300x400?text=No+Photo';

            return (
              <div
                key={match.user_id}
                className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                style={{ aspectRatio: '3/4' }}
                onClick={() => {
                  // TODO: Navigate to chat with this person
                  console.log('Open chat with', match.name);
                }}
              >
                {/* Photo */}
                <img
                  src={photoUrl}
                  alt={match.name}
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {match.name}
                    </h3>
                    {match.is_verified && (
                      <span className="text-blue-400 text-sm">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    {match.age && <span>{match.age} лет</span>}
                    {match.distance_km && (
                      <>
                        <span>•</span>
                        <span>{match.distance_km} км</span>
                      </>
                    )}
                  </div>
                  {/* Common interests */}
                  {match.common_interests && match.common_interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.common_interests.slice(0, 2).map((interest: any, idx: number) => (
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

                {/* Heart indicator - handshake for matches */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(108, 99, 255, 0.9)',
                    boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
                  }}
                >
                  <span className="text-white text-lg">🤝</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="max-w-lg mx-auto mt-8 text-center">
          <button
            onClick={() => window.location.href = '/discovery'}
            style={{ backgroundColor: '#6C63FF' }}
            className="text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Продолжить поиск партнёров
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
