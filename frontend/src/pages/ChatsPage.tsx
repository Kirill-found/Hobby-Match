import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';

export default function ChatsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / 3600000);

    if (hours < 1) return 'сейчас';
    if (hours < 24) return `${hours < 10 ? '0' : ''}${hours}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}`;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0E11', minHeight: '100vh', paddingBottom: '80px' }}>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0E11', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ padding: '16px 0', textAlign: 'center' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: 0 }}>
          Чаты
        </h1>
      </div>

      {/* Empty State */}
      {conversations.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
          <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
            Пока нет чатов
          </h2>
          <p style={{ color: '#6E6E8F', fontSize: '14px', margin: 0 }}>
            Найди людей с общими интересами и начни общение!
          </p>
        </div>
      ) : (
        /* Chat List */
        <div style={{ padding: '0 16px' }}>
          {conversations.map((conversation) => (
          <div
            key={conversation.match_id}
            onClick={() => navigate(`/chat/${conversation.match_id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 0',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: conversation.partner_photo
                  ? `url(${conversation.partner_photo}) center/cover`
                  : 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
                flexShrink: 0,
                marginRight: '12px',
              }}
            />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conversation.partner_name}
                </h3>
                <span style={{ color: '#6E6E8F', fontSize: '12px', marginLeft: '8px', flexShrink: 0 }}>
                  {formatTime(conversation.last_message_time)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#6E6E8F', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conversation.last_message || 'Начните общение'}
                </p>
                {/* Unread dot */}
                {conversation.unread_count > 0 && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#BFFF00',
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}
                  />
                )}
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
