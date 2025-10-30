import { useState, useRef } from 'react';
import type { DiscoveryUser } from '../api/discovery';

interface UserCardProps {
  user: DiscoveryUser;
  onLike: () => void;
  onDislike: () => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (showDetails) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || showDetails) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    if (Math.abs(deltaY) < Math.abs(deltaX)) {
      setDragOffset({ x: deltaX, y: deltaY * 0.3 });
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || showDetails) return;
    setIsDragging(false);
    const swipeThreshold = 100;

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      if (dragOffset.x > 0) {
        animateSwipeOut('right');
        setTimeout(() => onLike(), 300);
      } else {
        animateSwipeOut('left');
        setTimeout(() => onDislike(), 300);
      }
    } else {
      resetCard();
    }
  };

  const animateSwipeOut = (direction: 'left' | 'right') => {
    if (!cardRef.current) return;
    const distance = direction === 'left' ? -1000 : 1000;
    cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    cardRef.current.style.transform = `translateX(${distance}px) rotate(${direction === 'left' ? -30 : 30}deg)`;
    cardRef.current.style.opacity = '0';
  };

  const resetCard = () => {
    setDragOffset({ x: 0, y: 0 });
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
      cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
    }
  };

  const getRotation = () => {
    const maxRotation = 15;
    const rotation = (dragOffset.x / 300) * maxRotation;
    return Math.max(-maxRotation, Math.min(maxRotation, rotation));
  };

  const getLikeOpacity = () => Math.max(0, Math.min(1, dragOffset.x / 100));
  const getDislikeOpacity = () => Math.max(0, Math.min(1, -dragOffset.x / 100));

  const interestColors = ['#C873FF', '#4E9EFF', '#FF7A45', '#38D39F'];
  const getInterestColor = (index: number) => interestColors[index % interestColors.length];

  return (
    <div className="relative w-full h-full">
      {/* Main Card */}
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden"
        style={{
          height: 'calc(100vh - 220px)',
          maxHeight: '650px',
          borderRadius: '24px',
          backgroundColor: '#1A1A22',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          transform: isDragging
            ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`
            : 'translateX(0) translateY(0) rotate(0deg)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleDragStart(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          if (isDragging) {
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
          }
        }}
        onTouchEnd={handleDragEnd}
      >
        {/* Like indicator */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '40px',
            transform: 'translateY(-50%) rotate(-20deg)',
            fontSize: '80px',
            opacity: getLikeOpacity(),
            pointerEvents: 'none',
            zIndex: 20,
            transition: 'opacity 0.1s ease-out',
            filter: 'drop-shadow(0 0 20px rgba(56, 211, 159, 0.6))',
          }}
        >
          ❤️
        </div>

        {/* Dislike indicator */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '40px',
            transform: 'translateY(-50%) rotate(20deg)',
            fontSize: '80px',
            opacity: getDislikeOpacity(),
            pointerEvents: 'none',
            zIndex: 20,
            transition: 'opacity 0.1s ease-out',
            filter: 'drop-shadow(0 0 20px rgba(255, 122, 69, 0.6))',
          }}
        >
          ✖️
        </div>

        {/* Photo Section */}
        <div className="relative w-full" style={{ height: '70%' }}>
          {user.photos && user.photos.length > 0 ? (
            <img
              src={user.photos[0]}
              alt={user.name}
              className="w-full h-full object-cover"
              style={{ borderRadius: '24px 24px 0 0' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-9xl"
              style={{
                background: 'linear-gradient(135deg, #C873FF 0%, #4E9EFF 100%)',
                borderRadius: '24px 24px 0 0',
              }}
            >
              👤
            </div>
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(14, 14, 18, 0.95) 0%, transparent 100%)',
            }}
          />

          {/* Info button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(26, 26, 34, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(200, 115, 255, 0.3)',
              color: '#FFF',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(200, 115, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(26, 26, 34, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>

          {/* User Info */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
            }}
          >
            <h2
              className="text-3xl font-bold mb-1"
              style={{
                color: '#FFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {user.name}
              {user.age && <span>, {user.age}</span>}
            </h2>

            {user.city && (
              <div
                className="flex items-center gap-1 mb-3"
                style={{
                  color: '#B7B7C3',
                  fontSize: '15px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span>{user.city}</span>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-xl text-sm font-semibold"
                    style={{
                      backgroundColor: getInterestColor(index),
                      color: '#FFF',
                      boxShadow: `0 4px 12px ${getInterestColor(index)}40`,
                    }}
                  >
                    {interest.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="p-5" style={{ height: '30%', display: 'flex', flexDirection: 'column' }}>
          {user.bio && (
            <p
              className="text-sm mb-4 leading-relaxed"
              style={{
                color: '#B7B7C3',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {user.bio}
            </p>
          )}

          {/* Action Button */}
          <button
            onClick={onLike}
            className="w-full h-12 rounded-full font-bold text-base flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #38D39F 0%, #4E9EFF 100%)',
              color: '#FFF',
              border: 'none',
              boxShadow: '0 8px 20px rgba(56, 211, 159, 0.25)',
              cursor: 'pointer',
              marginTop: 'auto',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 28px rgba(56, 211, 159, 0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 211, 159, 0.25)'}
          >
            <span>👋</span>
            <span>Say Hello</span>
          </button>
        </div>

        {/* Details Modal */}
        {showDetails && (
          <div
            onClick={() => setShowDetails(false)}
            className="absolute inset-0 overflow-y-auto p-6"
            style={{
              backgroundColor: 'rgba(14, 14, 18, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              zIndex: 30,
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="text-right mb-4">
              <button
                onClick={() => setShowDetails(false)}
                className="text-3xl"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B7B7C3',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {user.photos && user.photos.length > 0 && (
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover mb-5"
              />
            )}

            <h2 className="text-3xl font-bold mb-2" style={{ color: '#FFF' }}>
              {user.name}, {user.age}
            </h2>

            {user.city && (
              <p className="flex items-center gap-1 mb-6" style={{ color: '#B7B7C3' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {user.city}
              </p>
            )}

            {user.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FFF' }}>О себе</h3>
                <p className="text-base leading-relaxed" style={{ color: '#B7B7C3' }}>
                  {user.bio}
                </p>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FFF' }}>Интересы</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: '#1A1A22',
                        color: '#FFF',
                        border: `1px solid ${getInterestColor(index)}40`,
                      }}
                    >
                      <span>{interest.icon}</span>
                      <span>{interest.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.reliability_score !== undefined && user.reliability_score > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FFF' }}>Надежность</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold" style={{ color: '#FF7A45' }}>
                    {user.reliability_score.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
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
