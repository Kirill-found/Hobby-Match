import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';

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

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин`;
    if (hours < 24) return `${hours} ч`;
    if (days < 7) return `${days} дн`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F0F', paddingBottom: '88px' }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-400 text-base">Загружаем чаты...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F0F', paddingBottom: '88px' }}>
        <div className="text-center px-6 max-w-md mx-auto">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-white mb-3">Что-то пошло не так</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button onClick={loadConversations} className="tinder-button">
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          backgroundColor: '#1A1A1A',
          borderBottom: '1px solid #2A2A2A',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="mx-auto px-6 py-5" style={{ maxWidth: '480px' }}>
          <h1 className="text-2xl font-bold text-white">Сообщения</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingBottom: '96px', minHeight: 'calc(100vh - 72px)' }}>
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 168px)' }}>
            <div className="text-center px-6 max-w-md mx-auto">
              <div className="text-7xl mb-6">💬</div>
              <h2 className="text-2xl font-bold text-white mb-3">Пока нет сообщений</h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Когда у вас появятся мэтчи, вы сможете начать общение здесь
              </p>
              <button onClick={() => navigate('/discovery')} className="tinder-button">
                Найти партнёров
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto" style={{ maxWidth: '480px' }}>
            {conversations.map((conversation) => (
              <div
                key={conversation.match_id}
                onClick={() => navigate(`/chat/${conversation.match_id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  borderBottom: '1px solid #2A2A2A',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', marginRight: '12px' }}>
                  {conversation.partner_photo ? (
                    <img
                      src={conversation.partner_photo}
                      alt={conversation.partner_name}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#2A2A2A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      👤
                    </div>
                  )}
                  {/* Unread badge */}
                  {conversation.unread_count > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: '#FF4458',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        minWidth: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        border: '2px solid #0F0F0F',
                      }}
                    >
                      {conversation.unread_count}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>
                      {conversation.partner_name}
                    </h3>
                    <span style={{ fontSize: '14px', color: '#666666', flexShrink: 0, marginLeft: '8px' }}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {conversation.last_message ? (
                      <>
                        <p
                          style={{
                            fontSize: '14px',
                            color: conversation.unread_count > 0 ? '#FFFFFF' : '#666666',
                            fontWeight: conversation.unread_count > 0 ? '500' : '400',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {conversation.is_last_message_from_me && (
                            <span style={{ marginRight: '4px' }}>
                              {/* Checkmarks for read status */}
                              <span style={{ color: '#4A9DFF' }}>✓✓</span>
                            </span>
                          )}
                          {conversation.last_message}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontSize: '14px', color: '#666666', fontStyle: 'italic' }}>
                        Начните общение
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
