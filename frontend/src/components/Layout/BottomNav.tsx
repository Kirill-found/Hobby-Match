import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

// SVG Icon Components - Simplified for playful look
const ChatIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
      stroke={active ? "#3717fd" : "#666680"}
      strokeWidth="2.5"
      fill={active ? "#d7ff81" : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
      stroke={active ? "#ff4365" : "#666680"}
      strokeWidth="2.5"
      fill={active ? "#ff4365" : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DiscoveryIcon = ({ active }: { active: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"
      stroke={active ? "#3717fd" : "#666680"}
      strokeWidth="2.5"
      fill={active ? "#bc96ff" : "none"}
    />
    <circle cx="12" cy="12" r="3"
      fill={active ? "#3717fd" : "#666680"}
    />
  </svg>
);

const FlameIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0.67C13.5 0.67 11.5 4.67 11.5 8C11.5 9.66 12.83 11 14.5 11C16.17 11 17.5 9.66 17.5 8C17.5 6.34 15.5 2.34 15.5 2.34L13.5 0.67ZM14.5 13C10.92 13 8 15.92 8 19.5C8 23.08 10.92 26 14.5 26C18.08 26 21 23.08 21 19.5C21 15.92 18.08 13 14.5 13Z"
      fill={active ? "#ff4365" : "#666680"}
      transform="scale(0.7) translate(3, -2)"
    />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4"
      stroke={active ? "#3717fd" : "#666680"}
      strokeWidth="2.5"
      fill={active ? "#d7ff81" : "none"}
    />
    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z"
      stroke={active ? "#3717fd" : "#666680"}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isActive = (path: string) => {
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
    },
    {
      path: '/likes',
      icon: HeartIcon,
      label: 'Лайки',
      badge: 4,
    },
    {
      path: '/discovery',
      icon: DiscoveryIcon,
      label: 'Поиск',
      badge: 0,
    },
    {
      path: '/matches',
      icon: FlameIcon,
      label: 'Мэтчи',
      badge: 2,
    },
    {
      path: '/profile',
      icon: ProfileIcon,
      label: 'Я',
      badge: 0,
    },
  ];

  return (
    <>
      {/* Playful Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* Main Nav Container - White with shadow */}
        <div
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 -4px 20px rgba(55, 23, 253, 0.08)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
            borderTop: '3px solid transparent',
            borderImage: 'linear-gradient(90deg, #3717fd 0%, #bc96ff 50%, #ff4365 100%)',
            borderImageSlice: 1,
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
              padding: '12px 16px 0',
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
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: active ? '8px 16px' : '8px 12px',
                    borderRadius: '20px',
                    backgroundColor: active ? '#f0ebff' : 'transparent',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    transform: active
                      ? 'scale(1.1) translateY(-4px)'
                      : isHovered
                      ? 'scale(1.05) translateY(-2px)'
                      : 'scale(1)',
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

                    {/* Badge with lime background */}
                    {item.badge > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#d7ff81',
                          color: '#3717fd',
                          fontSize: '11px',
                          fontWeight: '700',
                          borderRadius: '12px',
                          minWidth: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 6px',
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 8px rgba(55, 23, 253, 0.2)',
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
                      color: active ? '#3717fd' : '#666680',
                      letterSpacing: '0.01em',
                      transition: 'all 0.2s ease-out',
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#d7ff81',
                        boxShadow: '0 0 10px rgba(215, 255, 129, 0.6)',
                      }}
                    />
                  )}
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
            transform: scale(1.15);
            opacity: 0.9;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
