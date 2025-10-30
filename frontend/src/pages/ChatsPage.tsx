import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ChatsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

    if (minutes < 1) return 'сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AABEE] mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка чатов...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Не удалось загрузить чаты</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={loadConversations}
            className="px-6 py-2.5 bg-[#2AABEE] hover:bg-[#2AABEE]/90 text-white rounded-lg font-medium transition-colors"
          >
            Попробовать снова
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header - Telegram Style */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-[28px] font-bold mb-4">Чаты</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary/50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-[#2AABEE]"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center space-y-3 max-w-[280px]">
            <MessageCircle className="w-20 h-20 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-semibold text-base">
                {searchQuery ? 'Ничего не найдено' : 'Пока нет чатов'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {searchQuery
                  ? `Нет результатов по запросу "${searchQuery}"`
                  : 'Начните общение с вашими мэтчами'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => navigate('/discovery')}
                className="mt-4 px-6 py-2.5 bg-[#2AABEE] hover:bg-[#2AABEE]/90 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Найти партнёров
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="divide-y">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.match_id}
              onClick={() => navigate(`/chat/${conversation.match_id}`)}
              className="px-4 py-3 hover:bg-secondary/30 active:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Avatar - 64px large, Telegram style */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={conversation.partner_photo || undefined}
                      alt={conversation.partner_name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-white text-lg font-semibold">
                      {getInitials(conversation.partner_name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#0AC630] rounded-full border-[3px] border-background" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[17px] leading-tight truncate">
                      {conversation.partner_name}
                    </h3>
                    <span
                      className={`text-[13px] flex-shrink-0 ${
                        conversation.unread_count > 0
                          ? 'text-[#2AABEE] font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {conversation.is_last_message_from_me && (
                        <svg
                          width="18"
                          height="12"
                          viewBox="0 0 18 12"
                          fill="none"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M1.5 6L3.5 8L6.5 5"
                            stroke="#2AABEE"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 6L7 8L10 5"
                            stroke="#2AABEE"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <p
                        className={`text-[15px] leading-tight truncate ${
                          conversation.unread_count > 0
                            ? 'font-medium text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {conversation.last_message || 'Фото'}
                      </p>
                    </div>

                    {/* Unread Badge - Telegram style */}
                    {conversation.unread_count > 0 && (
                      <Badge
                        className="bg-[#2AABEE] hover:bg-[#2AABEE] text-white min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex-shrink-0"
                      >
                        {conversation.unread_count}
                      </Badge>
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
