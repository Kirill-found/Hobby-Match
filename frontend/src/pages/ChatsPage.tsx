import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';

export default function ChatsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredConversations(
        conversations.filter((conv) =>
          conv.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getConversations();
      setConversations(data);
      setFilteredConversations(data);
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

  // Separate new matches (last 7 days)
  const newMatches = conversations.filter((conv) => {
    if (!conv.last_message_time) return true;
    const matchDate = new Date(conv.last_message_time);
    const daysDiff = (Date.now() - matchDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 7;
  }).slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B9D] mx-auto"></div>
          <p className="text-sm text-[#8E8E93]">Загрузка чатов...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-6xl">💬</div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Не удалось загрузить чаты</h2>
            <p className="text-sm text-[#8E8E93]">{error}</p>
          </div>
          <button
            onClick={loadConversations}
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B9D] to-[#C766FF] text-white rounded-full font-medium transition-transform active:scale-95"
          >
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-[#2C2C2E]">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate('/discovery')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <h1 className="text-xl font-bold">Chats</h1>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="2"/>
              <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="px-4 pb-3 animate-in">
            <input
              type="text"
              placeholder="Поиск по чатам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1C1E] border-0 text-white placeholder:text-[#8E8E93] h-9 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B9D]"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Content */}
      {filteredConversations.length === 0 ? (
        // Empty State
        <div className="flex items-center justify-center min-h-[70vh] px-6">
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#C766FF] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L14.5 8L20 9L16 13L17 19L12 16L7 19L8 13L4 9L9.5 8L12 3Z" fill="white"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {searchQuery ? 'Ничего не найдено' : 'Find Your Hobby Match!'}
              </h3>
              <p className="text-[#8E8E93] leading-relaxed">
                {searchQuery
                  ? `Нет результатов по запросу "${searchQuery}"`
                  : 'Start swiping to find people who share your interests'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => navigate('/discovery')}
                className="w-full h-12 bg-gradient-to-r from-[#FF6B9D] to-[#C766FF] text-white rounded-full font-semibold transition-transform active:scale-95 shadow-lg shadow-[#FF6B9D]/30"
              >
                Start Discovering
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* NEW MATCHES Section */}
          {newMatches.length > 0 && !searchQuery && (
            <div className="pt-5 pb-3">
              <h2 className="px-4 text-[13px] font-bold text-white uppercase tracking-wider mb-3">
                NEW MATCHES ✨
              </h2>
              <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {newMatches.map((match, index) => (
                  <div
                    key={match.match_id}
                    onClick={() => navigate(`/chat/${match.match_id}`)}
                    className="flex-shrink-0 cursor-pointer"
                    style={{
                      animation: `fadeInScale 300ms ease-out ${index * 50}ms both`,
                    }}
                  >
                    <div className="relative">
                      <div className="w-[72px] h-[72px] rounded-full p-0.5 bg-gradient-to-br from-[#FF6B9D] to-[#C766FF]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-lg font-semibold border-2 border-black">
                          {match.partner_photo ? (
                            <img
                              src={match.partner_photo}
                              alt={match.partner_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(match.partner_name)
                          )}
                        </div>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#30D158] rounded-full border-[3px] border-black"></div>
                    </div>
                    <p className="text-sm font-medium text-white text-center mt-2 max-w-[72px] truncate">
                      {match.partner_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES Section */}
          <div className="pt-5">
            <div className="px-4 mb-3">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
                MESSAGES 💬
              </h2>
            </div>

            {/* Chat List */}
            <div>
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.match_id}
                  onClick={() => navigate(`/chat/${conversation.match_id}`)}
                  className="px-4 py-3 hover:bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors cursor-pointer border-b border-[#2C2C2E] last:border-b-0"
                  style={{
                    animation: `slideUpFade 400ms ease-out ${index * 30}ms both`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-base font-semibold">
                        {conversation.partner_photo ? (
                          <img
                            src={conversation.partner_photo}
                            alt={conversation.partner_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(conversation.partner_name)
                        )}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#30D158] rounded-full border-2 border-black"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Time */}
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <h3
                          className={`font-semibold text-base leading-tight truncate text-white`}
                          style={{
                            textShadow:
                              conversation.unread_count > 0
                                ? '0 0 8px rgba(255,255,255,0.3)'
                                : 'none',
                          }}
                        >
                          {conversation.partner_name}
                        </h3>
                        <span className="text-xs text-[#8E8E93] flex-shrink-0">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>

                      {/* Message Preview and Unread Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {conversation.is_last_message_from_me && (
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="flex-shrink-0">
                              <path d="M1 5.5L3 7.5L5.5 5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.5 5.5L6.5 7.5L9 5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          <p
                            className={`text-sm leading-tight truncate ${
                              conversation.unread_count > 0
                                ? 'font-semibold text-white'
                                : 'text-[#8E8E93]'
                            }`}
                          >
                            {conversation.last_message || 'Начните общение'}
                          </p>
                        </div>

                        {/* Unread Badge */}
                        {conversation.unread_count > 0 && (
                          <div className="bg-gradient-to-r from-[#FF6B9D] to-[#C766FF] text-white h-5 px-2 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF6B9D]/40">
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <BottomNav />

      {/* Animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .animate-in {
          animation: slideDown 200ms ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
