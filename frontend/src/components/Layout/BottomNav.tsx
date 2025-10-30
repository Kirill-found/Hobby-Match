import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

// SVG Icon Components with updated colors
const ChatIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
      fill={active ? "#FFFFFF" : "none"}
    />
  </svg>
);

const HeartIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
      stroke={active ? "#FF4458" : "#666666"}
      strokeWidth="2"
      fill={active ? "#FF4458" : "none"}
    />
  </svg>
);

const LogoIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"
      stroke={active ? "#667EEA" : "#666666"}
      strokeWidth="2"
      fill="none"
    />
    <path d="M8 12L11 15L16 9"
      stroke={active ? "#667EEA" : "#666666"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FlameIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0.67C13.5 0.67 11.5 4.67 11.5 8C11.5 9.66 12.83 11 14.5 11C16.17 11 17.5 9.66 17.5 8C17.5 6.34 15.5 2.34 15.5 2.34L13.5 0.67ZM14.5 13C10.92 13 8 15.92 8 19.5C8 23.08 10.92 26 14.5 26C18.08 26 21 23.08 21 19.5C21 15.92 18.08 13 14.5 13Z"
      fill={active ? "#F97316" : "#666666"}
      transform="scale(0.7) translate(3, -2)"
    />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
      fill={active ? "#FFFFFF" : "none"}
    />
    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
      fill={active ? "#FFFFFF" : "none"}
    />
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isActive = (path: string) => {
    // Chat icon is active for both /chats and /chat/:id
    if (path === '/chats') {
      return location.pathname === '/chats' || location.pathname.startsWith('/chat/');
    }
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/chats',
      icon: ChatIcon,
      label: 'Чаты',
      badge: 0,
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
    {
      path: '/likes',
      icon: HeartIcon,
      label: 'Лайки',
      badge: 4,
      glowColor: 'rgba(255, 68, 88, 0.6)',
    },
    {
      path: '/discovery',
      icon: LogoIcon,
      label: 'Поиск',
      badge: 0,
      glowColor: 'rgba(102, 126, 234, 0.6)',
    },
    {
      path: '/matches',
      icon: FlameIcon,
      label: 'Мэтчи',
      badge: 2,
      glowColor: 'rgba(249, 115, 22, 0.6)',
    },
    {
      path: '/profile',
      icon: ProfileIcon,
      label: 'Я',
      badge: 0,
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
  ];

  return (
    <>
      {/* Navigation Bar with Glassmorphism */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* Neon Gradient Border */}
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #ff006b 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />

        {/* Main Nav Container with Glassmorphism */}
        <div
          style={{
            backgroundColor: 'rgba(26, 26, 30, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // Safari support
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              height: '72px',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '8px 16px 0',
            }}
          >
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              const isHovered = hoveredIndex === index;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    transition: 'all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    transform: active
                      ? 'scale(1.15)'
                      : isHovered
                      ? 'scale(1.05)'
                      : 'scale(1)',
                    filter: active
                      ? `drop-shadow(0 0 ${isHovered ? '25px' : '20px'} ${item.glowColor})`
                      : isHovered
                      ? `drop-shadow(0 0 10px ${item.glowColor})`
                      : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      position: 'relative',
                      animation: active ? 'bounceIn 0.5s ease-out' : 'none',
                    }}
                  >
                    <Icon active={active} />

                    {/* Badge with Pulse Animation */}
                    {item.badge > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: 'linear-gradient(135deg, #FF4458 0%, #c2185b 100%)',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '700',
                          borderRadius: '9px',
                          minWidth: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 5px',
                          border: '2px solid rgba(26, 26, 30, 0.9)',
                          boxShadow: '0 0 8px rgba(255, 68, 88, 0.5)',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: active ? '#FFFFFF' : '#6E6E8F',
                      opacity: active ? 1 : 0.7,
                      letterSpacing: '0.02em',
                      transition: 'all 0.2s ease-out',
                      textShadow: active ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
