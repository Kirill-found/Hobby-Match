import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadConversations}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold">Чаты</h1>
        </div>
      </div>

      {/* Chat List */}
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center min-h-[70vh] px-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Нет чатов</p>
            <button
              onClick={() => navigate('/discovery')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Начать поиск
            </button>
          </div>
        </div>
      ) : (
        <div>
          {conversations.map((conversation) => (
            <div
              key={conversation.match_id}
              onClick={() => navigate(`/chat/${conversation.match_id}`)}
              className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold flex-shrink-0">
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
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.partner_name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message || 'Начните общение'}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
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
