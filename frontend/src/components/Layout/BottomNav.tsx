import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/chats') {
      return location.pathname === '/chats' || location.pathname.startsWith('/chat/');
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/chats', label: 'Чаты' },
    { path: '/likes', label: 'Лайки' },
    { path: '/discovery', label: 'Поиск' },
    { path: '/matches', label: 'Мэтчи' },
    { path: '/profile', label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
