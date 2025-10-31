import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';
import Button from '../components/common/Button';

export default function ChatsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить чаты');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days}д`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // BRANDBOOK: Loading State
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0D1117' }}
      >
        <div className="text-center">
          {/* Electric Lime spinner */}
          <div
            className="animate-spin rounded-full h-16 w-16 mx-auto"
            style={{
              background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff 0)',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff 0)',
              boxShadow: '0 0 30px rgba(191, 255, 0, 0.4)',
            }}
          />
          <p
            className="mt-6 text-lg"
            style={{
              color: '#B4B4C8',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Загрузка...
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // BRANDBOOK: Error State
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: '#0D1117' }}
      >
        <div className="text-center max-w-sm">
          <p
            className="text-lg mb-6"
            style={{
              color: '#FF3B30',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {error}
          </p>
          <Button onClick={loadConversations} variant="primary">
            Попробовать снова
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: '#0D1117' }}
    >
      {/* BRANDBOOK: Header */}
      <div
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: '#161B22',
          borderBottomColor: 'rgba(191, 255, 0, 0.1)',
        }}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <h1
            className="text-2xl font-bold"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Чаты
          </h1>
        </div>
      </div>

      {/* BRANDBOOK: Empty State */}
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center min-h-[70vh] px-6">
          <div className="text-center max-w-md">
            {/* Empty state icon */}
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
                boxShadow: '0 0 40px rgba(191, 255, 0, 0.3)',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="#0D1117"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              className="text-xl mb-6"
              style={{
                color: '#B4B4C8',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Нет чатов
            </p>
            <Button onClick={() => navigate('/discovery')} variant="primary">
              Начать поиск
            </Button>
          </div>
        </div>
      ) : (
        // BRANDBOOK: Chat List
        <div className="px-3 pt-3 space-y-3">
          {conversations.map((conversation) => (
            <div
              key={conversation.match_id}
              onClick={() => navigate(`/chat/${conversation.match_id}`)}
              className="rounded-2xl p-4 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#161B22',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1C2128';
                e.currentTarget.style.borderColor = 'rgba(191, 255, 0, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(191, 255, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#161B22';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-3">
                {/* BRANDBOOK: Avatar with Lime gradient */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{
                    background: conversation.partner_photo
                      ? 'transparent'
                      : 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
                    color: '#0D1117',
                    boxShadow: conversation.partner_photo
                      ? 'none'
                      : '0 4px 16px rgba(191, 255, 0, 0.3)',
                  }}
                >
                  {conversation.partner_photo ? (
                    <img
                      src={conversation.partner_photo}
                      alt={conversation.partner_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(conversation.partner_name)
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3
                      className="font-bold truncate"
                      style={{
                        color: '#FFFFFF',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.125rem',
                      }}
                    >
                      {conversation.partner_name}
                    </h3>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{
                        color: '#6E6E8F',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-sm truncate"
                      style={{
                        color: '#B4B4C8',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {conversation.last_message || 'Начните общение'}
                    </p>
                    {/* BRANDBOOK: Unread badge with Lime */}
                    {conversation.unread_count > 0 && (
                      <span
                        className="text-xs font-bold rounded-full px-2.5 py-1 flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
                          color: '#0D1117',
                          boxShadow: '0 0 12px rgba(191, 255, 0, 0.4)',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
