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

    if (minutes < 1) return 'сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    if (days < 7) return `${days}д`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e8d5ff 0%, #f5ebff 50%, #ffe8f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '88px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background blobs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(188, 150, 255, 0.3) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 67, 101, 0.2) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite 1s',
        }} />

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{
            fontSize: '72px',
            animation: 'bounce 1s ease-in-out infinite',
            marginBottom: '24px',
            filter: 'drop-shadow(0 4px 12px rgba(55, 23, 253, 0.3))'
          }}>
            💬
          </div>
          <p style={{
            color: '#3717fd',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Загружаем чаты...
          </p>
        </div>
        <BottomNav />
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -30px) scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e8d5ff 0%, #f5ebff 50%, #ffe8f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '88px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '40px',
          padding: '48px 32px',
          boxShadow: '0 20px 60px rgba(55, 23, 253, 0.15)',
          border: '3px solid #bc96ff',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: '96px', marginBottom: '24px' }}>😕</div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#3717fd',
            marginBottom: '16px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Что-то пошло не так
          </h2>
          <p style={{
            color: '#666680',
            fontSize: '16px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            {error}
          </p>
          <button
            onClick={loadConversations}
            style={{
              background: 'linear-gradient(135deg, #3717fd 0%, #bc96ff 100%)',
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '30px',
              border: 'none',
              fontSize: '17px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(55, 23, 253, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(55, 23, 253, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(55, 23, 253, 0.4)';
            }}
          >
            Попробовать снова 🔄
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8d5ff 0%, #f5ebff 50%, #ffe8f5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Creative floating decorative elements */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '15px',
        fontSize: '48px',
        opacity: 0.2,
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none',
        transform: 'rotate(15deg)'
      }}>
        ⭐
      </div>
      <div style={{
        position: 'absolute',
        top: '150px',
        left: '20px',
        fontSize: '36px',
        opacity: 0.15,
        animation: 'float 9s ease-in-out infinite 2s',
        pointerEvents: 'none'
      }}>
        ✨
      </div>
      <div style={{
        position: 'absolute',
        top: '300px',
        right: '30px',
        fontSize: '40px',
        opacity: 0.18,
        animation: 'float 6s ease-in-out infinite 1s',
        pointerEvents: 'none',
        transform: 'rotate(-10deg)'
      }}>
        💜
      </div>

      {/* Gradient blobs */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        left: '-50px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(188, 150, 255, 0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'float 10s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '100px',
        right: '-80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 67, 101, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'float 12s ease-in-out infinite 3s',
        pointerEvents: 'none'
      }} />

      {/* Header - Creative Style */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(30px)',
          borderBottom: '3px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #3717fd, #bc96ff, #ff4365)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '24px 24px 20px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3717fd 0%, #bc96ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '-0.5px'
          }}>
            Сообщения 💬
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{
        paddingBottom: '100px',
        minHeight: 'calc(100vh - 100px)',
        position: 'relative',
        zIndex: 1
      }}>
        {conversations.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
            padding: '24px'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '440px'
            }}>
              {/* Playful empty state card with creative border */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '40px',
                padding: '56px 40px',
                boxShadow: '0 20px 60px rgba(55, 23, 253, 0.15)',
                border: '4px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #3717fd, #bc96ff, #ff4365, #d7ff81)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                position: 'relative'
              }}>
                {/* Decorative corner elements */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '24px',
                  opacity: 0.3
                }}>✨</div>
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  fontSize: '20px',
                  opacity: 0.25
                }}>💜</div>

                <div style={{
                  fontSize: '96px',
                  marginBottom: '28px',
                  animation: 'bounce 2s ease-in-out infinite'
                }}>💬</div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#3717fd',
                  marginBottom: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '-0.5px'
                }}>
                  Пока нет сообщений
                </h2>
                <p style={{
                  color: '#666680',
                  fontSize: '17px',
                  lineHeight: '1.7',
                  marginBottom: '36px',
                  fontWeight: '500'
                }}>
                  Когда у вас появятся мэтчи, вы сможете начать общение здесь
                </p>
                <button
                  onClick={() => navigate('/discovery')}
                  style={{
                    background: 'linear-gradient(135deg, #3717fd 0%, #bc96ff 100%)',
                    color: '#ffffff',
                    padding: '18px 48px',
                    borderRadius: '32px',
                    border: 'none',
                    fontSize: '17px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 28px rgba(55, 23, 253, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    fontFamily: 'Poppins, sans-serif',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.06) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(55, 23, 253, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(55, 23, 253, 0.4)';
                  }}
                >
                  Найти партнёров 🔍
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px 16px'
          }}>
            {conversations.map((conversation, index) => (
              <div
                key={conversation.match_id}
                onClick={() => navigate(`/chat/${conversation.match_id}`)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '28px',
                  padding: '18px 20px',
                  marginBottom: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  boxShadow: '0 4px 16px rgba(55, 23, 253, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  border: '2px solid rgba(188, 150, 255, 0.15)',
                  animation: `slideIn 0.4s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(55, 23, 253, 0.18)';
                  e.currentTarget.style.borderColor = '#bc96ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(55, 23, 253, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(188, 150, 255, 0.15)';
                }}
              >
                {/* Avatar with creative gradient border */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    padding: '3px',
                    borderRadius: '24px',
                    background: conversation.unread_count > 0
                      ? 'linear-gradient(135deg, #3717fd, #bc96ff, #ff4365)'
                      : 'linear-gradient(135deg, #bc96ff, #e8d5ff)',
                  }}>
                    {conversation.partner_photo ? (
                      <img
                        src={conversation.partner_photo}
                        alt={conversation.partner_name}
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '21px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '21px',
                          background: 'linear-gradient(135deg, #bc96ff 0%, #e8d5ff 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                        }}
                      >
                        👤
                      </div>
                    )}
                  </div>

                  {/* Unread badge - lime with purple text */}
                  {conversation.unread_count > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#d7ff81',
                        color: '#3717fd',
                        fontSize: '13px',
                        fontWeight: '800',
                        borderRadius: '16px',
                        minWidth: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 10px',
                        border: '3px solid #ffffff',
                        boxShadow: '0 4px 12px rgba(215, 255, 129, 0.5)',
                        animation: 'pulse 2s ease-in-out infinite',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {conversation.unread_count}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    alignItems: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1a1a2e',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {conversation.partner_name}
                    </h3>
                    <span style={{
                      fontSize: '14px',
                      color: '#bc96ff',
                      fontWeight: '700',
                      flexShrink: 0,
                      marginLeft: '12px',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {conversation.last_message ? (
                      <p
                        style={{
                          fontSize: '15px',
                          color: conversation.unread_count > 0 ? '#3717fd' : '#666680',
                          fontWeight: conversation.unread_count > 0 ? '600' : '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          margin: 0
                        }}
                      >
                        {conversation.is_last_message_from_me && (
                          <span style={{ marginRight: '8px', display: 'inline-flex', alignItems: 'center' }}>
                            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 5L3.5 7.5L7 4" stroke="#bc96ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5.5 5L8 7.5L11.5 4" stroke="#bc96ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                        {conversation.last_message}
                      </p>
                    ) : (
                      <p style={{
                        fontSize: '15px',
                        color: '#bc96ff',
                        fontStyle: 'italic',
                        margin: 0,
                        fontWeight: '600'
                      }}>
                        Начните общение ✨
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

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) translateX(15px) rotate(5deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
