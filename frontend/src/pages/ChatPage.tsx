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
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerAge, setPartnerAge] = useState<number | null>(null);
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null);
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
      const data = await chatApi.getMessages(Number(matchId));
      setMessages(data);

      // Get partner info from conversations
      if (user) {
        try {
          const conversations = await chatApi.getConversations();
          const currentConversation = conversations.find(c => c.match_id === Number(matchId));
          if (currentConversation) {
            setPartnerId(currentConversation.partner_id);
            setPartnerName(currentConversation.partner_name);
            setPartnerAge(currentConversation.partner_age);
            setPartnerPhoto(currentConversation.partner_photo);
          }
        } catch (err) {
          console.error('Error loading conversations:', err);
        }
      }
    } catch (err: any) {
      console.error('Error loading messages:', err);
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
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0E11', minHeight: '100vh' }}>
        <div style={{ padding: '20px', color: '#FFFFFF' }}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0E11', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button
          onClick={() => navigate('/chats')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ←
        </button>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: partnerPhoto
              ? `url(${partnerPhoto}) center/cover`
              : 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {partnerName}
          </h2>
          {partnerAge && (
            <p style={{ color: '#6E6E8F', fontSize: '13px', margin: 0 }}>
              {partnerAge} года
            </p>
          )}
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ⋮
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '80px' }}>
        {messages.map((message) => {
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
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: isMyMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: isMyMessage ? '#BFFF00' : '#2A2A2A',
                  color: isMyMessage ? '#0D0E11' : '#FFFFFF',
                  wordWrap: 'break-word',
                }}
              >
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>{message.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1A1A1A', borderRadius: '24px', padding: '8px 16px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Написать сообщение"
            disabled={sending}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            style={{
              background: 'none',
              border: 'none',
              color: newMessage.trim() ? '#BFFF00' : '#6E6E8F',
              fontSize: '18px',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              padding: '4px',
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
