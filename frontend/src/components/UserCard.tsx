import { useState, useRef } from 'react';
import type { DiscoveryUser } from '../api/discovery';

interface UserCardProps {
  user: DiscoveryUser;
  onLike: () => void;
  onDislike: () => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const distance = user.distance_km;

  // Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Touch/Mouse event handlers for swipe
  const handleDragStart = (clientX: number, clientY: number) => {
    if (showDetails) return; // Don't swipe when details are open
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || showDetails) return;

    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;

    // Only allow horizontal swipes (ignore if vertical swipe is dominant)
    if (Math.abs(deltaY) < Math.abs(deltaX)) {
      setDragOffset({ x: deltaX, y: deltaY * 0.3 }); // Reduce vertical movement
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || showDetails) return;
    setIsDragging(false);

    const swipeThreshold = 100; // pixels to trigger swipe

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      // Trigger swipe action
      if (dragOffset.x > 0) {
        // Swiped right - Like
        animateSwipeOut('right');
        setTimeout(() => {
          onLike();
        }, 300);
      } else {
        // Swiped left - Dislike
        animateSwipeOut('left');
        setTimeout(() => {
          onDislike();
        }, 300);
      }
    } else {
      // Return to center
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

  // Calculate rotation based on drag distance
  const getRotation = () => {
    const maxRotation = 15; // degrees
    const rotation = (dragOffset.x / 300) * maxRotation;
    return Math.max(-maxRotation, Math.min(maxRotation, rotation));
  };

  // Calculate opacity for like/dislike indicators
  const getLikeOpacity = () => Math.max(0, Math.min(1, dragOffset.x / 100));
  const getDislikeOpacity = () => Math.max(0, Math.min(1, -dragOffset.x / 100));

  return (
    <div className="relative w-full h-full">
      {/* Main Card - Twinby Style with Swipe */}
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden"
        style={{
          height: 'calc(100vh - 160px)',
          maxHeight: '700px',
          borderRadius: '24px',
          backgroundColor: '#1A1A1A',
          transform: isDragging
            ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`
            : 'translateX(0) translateY(0) rotate(0deg)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
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
            fontWeight: 'bold',
            color: '#00FF00',
            textShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
            opacity: getLikeOpacity(),
            pointerEvents: 'none',
            zIndex: 20,
            transition: 'opacity 0.1s ease-out',
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
            fontWeight: 'bold',
            color: '#FF0000',
            textShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
            opacity: getDislikeOpacity(),
            pointerEvents: 'none',
            zIndex: 20,
            transition: 'opacity 0.1s ease-out',
          }}
        >
          ✖️
        </div>
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
