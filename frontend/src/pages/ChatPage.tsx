import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat';
import type { Message } from '../api/chat';
import { useUserStore } from '../store/userStore';

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchId) {
      loadMessages();
    }
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getMessages(Number(matchId));
      setMessages(data);

      // Determine partner ID from messages or conversations
      if (data.length > 0 && user) {
        const firstMessage = data[0];
        const determinedPartnerId = firstMessage.sender_id === user.id
          ? firstMessage.receiver_id
          : firstMessage.sender_id;
        setPartnerId(determinedPartnerId);
      } else if (user) {
        // If no messages yet, get partner info from conversations
        try {
          const conversations = await chatApi.getConversations();
          const currentConversation = conversations.find(c => c.match_id === Number(matchId));
          if (currentConversation) {
            setPartnerId(currentConversation.partner_id);
          }
        } catch (err) {
          console.error('Error loading conversations:', err);
        }
      }
    } catch (err: any) {
      console.error('Error loading messages:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить сообщения');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !matchId || !partnerId) return;

    try {
      setSending(true);
      const message = await chatApi.sendMessage({
        match_id: Number(matchId),
        receiver_id: partnerId,
        text: newMessage.trim(),
      });
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F0F' }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-400 text-base">Загружаем чат...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F0F' }}>
        <div className="text-center px-6 max-w-md mx-auto">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-white mb-3">Что-то пошло не так</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button onClick={loadMessages} className="tinder-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          backgroundColor: '#1A1A1A',
          borderBottom: '1px solid #2A2A2A',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="mx-auto px-4 py-4" style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/chats')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '24px',
                cursor: 'pointer',
                marginRight: '12px',
                padding: '4px',
              }}
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-white">Чат</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: '16px',
          paddingBottom: '80px',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {Object.entries(messageGroups).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div
              style={{
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              <span
                style={{
                  backgroundColor: '#2A2A2A',
                  color: '#888888',
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                }}
              >
                {formatDate(msgs[0].created_at)}
              </span>
            </div>

            {/* Messages */}
            {msgs.map((message) => {
              const isMyMessage = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 14px',
                      borderRadius: '18px',
                      backgroundColor: isMyMessage ? '#FF4458' : '#2A2A2A',
                      color: '#FFFFFF',
                      wordWrap: 'break-word',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>{message.text}</p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: '4px',
                        gap: '4px',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {formatTime(message.created_at)}
                      </span>
                      {isMyMessage && (
                        <span style={{ fontSize: '14px', color: message.is_read ? '#4A9DFF' : 'rgba(255, 255, 255, 0.7)' }}>
                          {message.is_read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0"
        style={{
          backgroundColor: '#1A1A1A',
          borderTop: '1px solid #2A2A2A',
          padding: '12px 16px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Сообщение..."
              disabled={sending}
              style={{
                flex: 1,
                backgroundColor: '#2A2A2A',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 16px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              style={{
                backgroundColor: newMessage.trim() ? '#FF4458' : '#2A2A2A',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: '20px',
                transition: 'all 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
