import { useState } from 'react';

interface UserCardProps {
  user: {
    user_id?: number;
    id?: number;
    name: string;
    age: number | null;
    bio: string | null;
    city?: string;
    interests?: Array<{ name: string; icon: string }>;
    common_interests?: any[];
    distance?: number;
    distance_km?: number | null;
    photos?: string[];
    reliability_score?: number;
    is_verified?: boolean;
  };
  onLike: () => void;
  onDislike: () => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const distance = user.distance_km || user.distance;

  return (
    <div className="relative w-full h-full">
      {/* Main Card - Twinby Style */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: 'calc(100vh - 160px)',
          maxHeight: '700px',
          borderRadius: '24px',
          backgroundColor: '#1A1A1A',
        }}
      >
        {/* Photo */}
        <div className="relative w-full h-full">
          {user.photos && user.photos.length > 0 ? (
            <img
              src={user.photos[0]}
              alt={user.name}
              className="w-full h-full object-cover"
              style={{ borderRadius: '24px' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-9xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
              }}
            >
              👤
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              borderRadius: '0 0 24px 24px',
            }}
          />

          {/* Top Icons - Minimalist semi-transparent hobby icons */}
          {user.interests && user.interests.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                maxWidth: '70%',
              }}
            >
              {user.interests.slice(0, 3).map((interest, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{interest.icon}</span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '500' }}>
                    {interest.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Verified badge */}
          {user.is_verified && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: '#4A9EFF',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              ✓
            </div>
          )}

          {/* Name and age - Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '4px',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {user.name}
              {user.age && (
                <span style={{ fontWeight: '400' }}>, {user.age}</span>
              )}
            </h2>

            {/* Location and distance */}
            {(user.city || distance) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                {distance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📍</span>
                    <span>{distance} км</span>
                  </div>
                )}
                {user.city && distance && <span>•</span>}
                {user.city && <span>{user.city}</span>}
              </div>
            )}

            {/* Swipe up indicator */}
            <div
              onClick={() => setShowDetails(!showDetails)}
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                cursor: 'pointer',
                opacity: 0.7,
              }}
            >
              <span>Подробнее</span>
              <span style={{ fontSize: '16px' }}>⬆️</span>
            </div>
          </div>
        </div>

        {/* Details Modal - Swipe Up (like Twinby) */}
        {showDetails && (
          <div
            onClick={() => setShowDetails(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '24px',
              overflowY: 'auto',
              padding: '24px',
              zIndex: 10,
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Close button */}
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Small photo */}
            {user.photos && user.photos.length > 0 && (
              <img
                src={user.photos[0]}
                alt={user.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  marginBottom: '20px',
                }}
              />
            )}

            {/* Name */}
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '8px',
              }}
            >
              {user.name}, {user.age}
            </h2>

            {/* Location */}
            {user.city && (
              <p style={{ color: '#999999', marginBottom: '24px' }}>
                📍 {user.city}
              </p>
            )}

            {/* About section */}
            {user.bio && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '12px',
                  }}
                >
                  О себе
                </h3>
                <p
                  style={{
                    color: '#CCCCCC',
                    lineHeight: '1.6',
                    fontSize: '15px',
                  }}
                >
                  {user.bio}
                </p>
              </div>
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '12px',
                  }}
                >
                  Интересы
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#2A2A2A',
                        color: '#FFFFFF',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{interest.icon}</span>
                      <span>{interest.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reliability */}
            {user.reliability_score !== undefined && user.reliability_score > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '12px',
                  }}
                >
                  Надежность
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>⭐</span>
                  <span style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600' }}>
                    {user.reliability_score.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons - Twinby style */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <button
          onClick={onDislike}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#2A2A2A',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Dislike"
        >
          ✖️
        </button>

        <button
          onClick={onLike}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#FF4458',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 68, 88, 0.4)',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Like"
        >
          ❤️
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
