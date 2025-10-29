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
      </div>

      {/* Matches Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {matches.map((match) => (
            <div
              key={match.user_id}
              className="relative bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                // TODO: Navigate to chat with this person
                console.log('Open chat with', match.name);
              }}
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-400 to-pink-400">
                {match.photos && match.photos.length > 0 ? (
                  <img
                    src={match.photos[0]}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Name and age */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-bold text-sm leading-tight">
                    {match.name}{match.age ? `, ${match.age}` : ''}
                  </h3>
                  {match.distance_km && (
                    <p className="text-white/90 text-xs">📍 {match.distance_km} км</p>
                  )}
                </div>

                {/* Heart indicator */}
                <div className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-xl">💚</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="max-w-lg mx-auto mt-8 text-center">
          <button
            onClick={() => window.location.href = '/discovery'}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Продолжить поиск партнёров
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
