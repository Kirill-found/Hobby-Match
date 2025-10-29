import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/discovery',
      icon: '🔍',
      label: 'Поиск',
      activeIcon: '🔍',
    },
    {
      path: '/likes',
      icon: '💚',
      label: 'Лайки',
      activeIcon: '💚',
      badge: 0, // TODO: dynamic count from API
    },
    {
      path: '/matches',
      icon: '🤝',
      label: 'Партнёры',
      activeIcon: '🤝',
      badge: 0, // TODO: dynamic count from API
    },
    {
      path: '/chat',
      icon: '💬',
      label: 'Чат',
      activeIcon: '💬',
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Профиль',
      activeIcon: '👤',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white z-50"
      style={{
        borderTop: '1px solid #E5E7EB',
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Centered container with max width for desktop */}
      <div className="mx-auto" style={{ maxWidth: '480px' }}>
        <div className="flex justify-around items-center px-4" style={{ height: '64px' }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-105"
                style={{
                  flex: '1',
                  minWidth: '60px',
                  maxWidth: '80px',
                }}
              >
                {/* Icon container */}
                <div className="relative flex items-center justify-center" style={{ width: '28px', height: '28px' }}>
                  <span style={{ fontSize: '24px', lineHeight: '1' }}>
                    {active ? item.activeIcon : item.icon}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span
                      className="absolute font-bold flex items-center justify-center"
                      style={{
                        top: '-4px',
                        right: '-8px',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        fontSize: '10px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '9px',
                        border: '2px solid white',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="font-medium transition-colors duration-200"
                  style={{
                    fontSize: '11px',
                    color: active ? '#6C63FF' : '#9CA3AF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {active && (
                  <div
                    className="absolute"
                    style={{
                      bottom: '-2px',
                      width: '32px',
                      height: '3px',
                      backgroundColor: '#6C63FF',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
