import { useNavigate, useLocation } from 'react-router-dom';

// SVG Icon Components (like Twinby)
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
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
      fill={active ? "#FFFFFF" : "none"}
    />
    <path d="M2 17L12 22L22 17"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
    />
    <path d="M2 12L12 17L22 12"
      stroke={active ? "#FFFFFF" : "#666666"}
      strokeWidth="2"
    />
  </svg>
);

const FlameIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0.67C13.5 0.67 11.5 4.67 11.5 8C11.5 9.66 12.83 11 14.5 11C16.17 11 17.5 9.66 17.5 8C17.5 6.34 15.5 2.34 15.5 2.34L13.5 0.67ZM14.5 13C10.92 13 8 15.92 8 19.5C8 23.08 10.92 26 14.5 26C18.08 26 21 23.08 21 19.5C21 15.92 18.08 13 14.5 13Z"
      fill={active ? "#FF6B00" : "#666666"}
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
      badge: 0,
    },
    {
      path: '/likes',
      icon: HeartIcon,
      badge: 4,
    },
    {
      path: '/discovery',
      icon: LogoIcon,
      badge: 0,
    },
    {
      path: '/matches',
      icon: FlameIcon,
      badge: 2,
    },
    {
      path: '/profile',
      icon: ProfileIcon,
      badge: 0,
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '72px',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px',
                transition: 'transform 0.2s ease',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Icon active={active} />

              {item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: '#FF4458',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px',
                    border: '2px solid #1A1A1A',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
