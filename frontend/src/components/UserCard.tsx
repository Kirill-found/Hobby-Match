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

  // Color mapping for interests
  const getInterestColor = (index: number) => {
    const colors = ['#8B5CF6', '#3B82F6', '#F97316']; // purple, blue, orange
    return colors[index % colors.length];
  };

  return (
    <div className="relative w-full h-full">
      {/* Main Card - Match/Twinby Style with Neon Border */}
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden"
        style={{
          height: 'calc(100vh - 220px)',
          maxHeight: '650px',
          borderRadius: '24px',
          backgroundColor: '#1A1A1A',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(#1A1A1A, #1A1A1A), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: `
            0 0 20px rgba(102, 126, 234, 0.3),
            0 0 40px rgba(118, 75, 162, 0.2),
            inset 0 0 60px rgba(102, 126, 234, 0.1)
          `,
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

        {/* Photo Section */}
        <div className="relative w-full" style={{ height: '70%' }}>
          {user.photos && user.photos.length > 0 ? (
            <img
              src={user.photos[0]}
              alt={user.name}
              className="w-full h-full object-cover"
              style={{ borderRadius: '20px 20px 0 0' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-9xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px 20px 0 0',
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
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          {/* User Info - Bottom Left on Photo */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
            }}
          >
            {/* Name and Age */}
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '4px',
              }}
            >
              {user.name}
              {user.age && (
                <span style={{ fontWeight: '700' }}>, {user.age}</span>
              )}
            </h2>

            {/* Location */}
            {user.city && (
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '400',
                  opacity: 0.9,
                  marginBottom: '12px',
                }}
              >
                {user.city}
              </div>
            )}

            {/* Interest Badges - Colorful */}
            {user.interests && user.interests.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.interests.slice(0, 3).map((interest, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: getInterestColor(index),
                      padding: '6px 14px',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {interest.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio Section - White area under photo */}
        <div style={{ padding: '20px', height: '30%', display: 'flex', flexDirection: 'column' }}>
          {user.bio && (
            <p
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                lineHeight: '1.5',
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {user.bio}
            </p>
          )}

          {/* Say Hello Button */}
          <button
            onClick={onLike}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              marginTop: 'auto',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <span>👋</span>
            <span>Say Hello</span>
          </button>
        </div>

        {/* Details Modal - Swipe Up */}
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
