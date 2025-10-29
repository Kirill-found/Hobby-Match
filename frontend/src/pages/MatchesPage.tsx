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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '88px' }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-500 text-base">Загружаем партнёров...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F8FA', paddingBottom: '88px' }}>
        <div className="text-center px-6 max-w-md mx-auto">
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
            Партнёры 🤝
          </h1>
          {matches.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {matches.length} {matches.length === 1 ? 'человек' : matches.length < 5 ? 'человека' : 'людей'}
            </p>
          )}
        </div>
      </div>

      {/* Content area */}
      <div style={{ paddingBottom: '96px', minHeight: 'calc(100vh - 72px)' }}>
        {/* Empty state */}
        {matches.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 168px)' }}>
            <div className="text-center px-6 max-w-md mx-auto">
              <div className="text-7xl mb-6">🤝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Пока нет партнёров</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Когда у вас будет взаимный интерес с кем-то, они появятся здесь
              </p>
              <button
                onClick={() => window.location.href = '/discovery'}
                className="tinder-button"
              >
                Найти партнёров
              </button>
            </div>
          </div>
        ) : (
          /* Grid and content */
          <>
            <div className="mx-auto px-4 py-6" style={{ maxWidth: '480px' }}>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {matches.map((match) => {
                  const photoUrl = match.photos && match.photos.length > 0
                    ? match.photos[0]
                    : 'https://via.placeholder.com/300x400?text=No+Photo';

                  return (
                    <div
                      key={match.user_id}
                      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                        }}
                      />

                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-white font-bold text-base leading-tight truncate">
                            {match.name}
                          </h3>
                          {match.is_verified && (
                            <span className="text-blue-400 text-sm flex-shrink-0">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-white text-sm mb-2">
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
                          <div className="flex flex-wrap gap-1">
                            {match.common_interests.slice(0, 2).map((interest: any, idx: number) => (
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

                      {/* Handshake indicator for matches */}
                      <div
                        className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'rgba(108, 99, 255, 0.95)',
                          boxShadow: '0 2px 8px rgba(108, 99, 255, 0.4)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>🤝</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to action */}
            <div className="mx-auto px-6 pb-6" style={{ maxWidth: '480px' }}>
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/discovery'}
                  style={{ backgroundColor: '#6C63FF' }}
                  className="text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-all shadow-md text-base"
                >
                  Продолжить поиск партнёров
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
