import { useState, useRef } from 'react';
import type { DiscoveryUser } from '../api/discovery';
import { Badge, Button } from './common';

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

  // BRANDBOOK: Interest category colors mapping
  const getCategoryColor = (interestName: string): any => {
    const lowerName = interestName.toLowerCase();

    // Fitness (Hot Pink #FF006B)
    if (lowerName.includes('спорт') || lowerName.includes('фитнес') || lowerName.includes('бег') ||
        lowerName.includes('йог') || lowerName.includes('теннис') || lowerName.includes('футбол') ||
        lowerName.includes('баскетбол') || lowerName.includes('волейбол') || lowerName.includes('бадминтон') ||
        lowerName.includes('плаван') || lowerName.includes('тренаж') || lowerName.includes('силов')) return 'fitness';

    // Travel (Cyan #00D9FF)
    if (lowerName.includes('путешеств') || lowerName.includes('туризм') || lowerName.includes('походы')) return 'travel';

    // Creative (Purple #9B51E0)
    if (lowerName.includes('творч') || lowerName.includes('искусств') || lowerName.includes('рисован') ||
        lowerName.includes('музык') || lowerName.includes('фото') || lowerName.includes('танц')) return 'creative';

    // Gaming (Amber #F59E0B)
    if (lowerName.includes('игр') || lowerName.includes('киберспорт') || lowerName.includes('видеоигр')) return 'gaming';

    // Learning (Blue #3B82F6)
    if (lowerName.includes('обуч') || lowerName.includes('язык') || lowerName.includes('програм') ||
        lowerName.includes('наук') || lowerName.includes('книг')) return 'learning';

    // Food (Red #EF4444)
    if (lowerName.includes('еда') || lowerName.includes('кулинар') || lowerName.includes('готов')) return 'food';

    return 'default';
  };

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
          backgroundColor: '#161B22',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
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
            opacity: getLikeOpacity(),
            pointerEvents: 'none',
            zIndex: 20,
            transition: 'opacity 0.1s ease-out',
            filter: 'drop-shadow(0 0 20px rgba(191, 255, 0, 0.6))',
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
            filter: 'drop-shadow(0 0 20px rgba(255, 59, 48, 0.6))',
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
                background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
                borderRadius: '24px 24px 0 0',
              }}
            >
              👤
            </div>
          )}

          {/* BRANDBOOK: Gradient overlay для читаемости */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(13, 17, 23, 0.95) 0%, transparent 100%)',
            }}
          />

          {/* Info button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(22, 27, 34, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(191, 255, 0, 0.3)',
              color: '#FFF',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ℹ️
          </button>

          {/* User Info Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
            }}
          >
            {/* BRANDBOOK: Space Grotesk for heading */}
            <h2
              className="text-3xl font-bold mb-1"
              style={{
                color: '#FFF',
                fontFamily: "'Space Grotesk', sans-serif",
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
                  color: '#B4B4C8',
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

            {/* Interests - BRANDBOOK badges */}
            {user.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <Badge
                    key={index}
                    category={getCategoryColor(interest.name || '')}
                  >
                    {interest.icon && <span>{interest.icon}</span>}
                    <span>{interest.name}</span>
                  </Badge>
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
                color: '#B4B4C8',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {user.bio}
            </p>
          )}

          {/* BRANDBOOK: Primary Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="mt-auto"
          >
            👋 Say Hello
          </Button>
        </div>

        {/* Details Modal */}
        {showDetails && (
          <div
            onClick={() => setShowDetails(false)}
            className="absolute inset-0 overflow-y-auto p-6"
            style={{
              backgroundColor: 'rgba(13, 17, 23, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              zIndex: 30,
            }}
          >
            <div className="text-right mb-4">
              <button
                onClick={() => setShowDetails(false)}
                className="text-3xl"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B4B4C8',
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

            <h2 className="text-3xl font-bold mb-2" style={{ color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
              {user.name}, {user.age}
            </h2>

            {user.city && (
              <p className="flex items-center gap-1 mb-6" style={{ color: '#B4B4C8' }}>
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
                <p className="text-base leading-relaxed" style={{ color: '#B4B4C8' }}>
                  {user.bio}
                </p>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FFF' }}>Интересы</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      category={getCategoryColor(interest.name || '')}
                    >
                      {interest.icon && <span>{interest.icon}</span>}
                      <span>{interest.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.reliability_score !== undefined && user.reliability_score > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FFF' }}>Надежность</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold" style={{ color: '#BFFF00' }}>
                    {user.reliability_score.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
