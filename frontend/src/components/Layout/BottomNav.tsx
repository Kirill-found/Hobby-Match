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
    {
      path: '/chats',
      label: 'Чаты',
      icon: (active: boolean) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? 'rgba(191, 255, 0, 0.1)' : 'none'}
          />
        </svg>
      ),
    },
    {
      path: '/likes',
      label: 'Лайки',
      icon: (active: boolean) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? 'rgba(191, 255, 0, 0.1)' : 'none'}
          />
        </svg>
      ),
    },
    {
      path: '/discovery',
      label: 'Поиск',
      icon: (active: boolean) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            fill={active ? 'rgba(191, 255, 0, 0.1)' : 'none'}
          />
          <path
            d="M12 8V12L14.5 14.5"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? 'rgba(191, 255, 0, 0.2)' : 'none'}
          />
        </svg>
      ),
    },
    {
      path: '/matches',
      label: 'Матчи',
      icon: (active: boolean) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? 'rgba(191, 255, 0, 0.1)' : 'none'}
          />
        </svg>
      ),
    },
    {
      path: '/profile',
      label: 'Профиль',
      icon: (active: boolean) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke={active ? '#BFFF00' : '#B4B4C8'}
            strokeWidth="2"
            fill={active ? 'rgba(191, 255, 0, 0.1)' : 'none'}
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: '#161B22',
        borderTopColor: 'rgba(191, 255, 0, 0.1)',
      }}
    >
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
              style={{
                color: active ? '#BFFF00' : '#B4B4C8',
                backgroundColor: active ? 'rgba(191, 255, 0, 0.05)' : 'transparent',
                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: active ? '0 0 12px rgba(191, 255, 0, 0.2)' : 'none',
              }}
            >
              {/* Icon */}
              <div className="transition-transform duration-200">
                {item.icon(active)}
              </div>

              {/* Label */}
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: active ? "'Space Grotesk', sans-serif" : "'Inter', sans-serif",
                  textShadow: active ? '0 0 8px rgba(191, 255, 0, 0.3)' : 'none',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
