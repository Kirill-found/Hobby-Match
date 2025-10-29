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
      badge: 4, // TODO: dynamic count from API
    },
    {
      path: '/matches',
      icon: '🤝',
      label: 'Партнёры',
      activeIcon: '🤝',
      badge: 1, // TODO: dynamic count from API
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-all"
              style={{
                color: active ? '#6C63FF' : '#9CA3AF',
              }}
            >
              <div className="relative text-2xl mb-0.5">
                {active ? item.activeIcon : item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
