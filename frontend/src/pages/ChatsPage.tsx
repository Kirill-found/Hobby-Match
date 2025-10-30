import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Sparkles } from 'lucide-react';
import { chatApi } from '../api/chat';
import type { ConversationPreview } from '../api/chat';
import BottomNav from '../components/Layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center pb-24">
        <div className="text-center space-y-4">
          <div className="animate-bounce">
            <MessageCircle className="w-16 h-16 text-primary mx-auto" />
          </div>
          <p className="text-lg font-semibold text-primary">Загружаем чаты...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6 pb-24">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-6xl">😕</div>
            <h2 className="text-2xl font-bold text-primary">Что-то пошло не так</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadConversations} className="w-full">
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-8 h-8 text-primary" />
                {conversations.some((c) => c.unread_count > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Сообщения
              </h1>
            </div>
            {conversations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {conversations.filter((c) => c.unread_count > 0).length > 0
                  ? `${conversations.filter((c) => c.unread_count > 0).length} новых`
                  : 'Все прочитаны'}
              </Badge>
            )}
          </div>

          {/* Search Bar */}
          {conversations.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-24 min-h-[calc(100vh-140px)]">
        {filteredConversations.length === 0 && !searchQuery ? (
          // Empty State
          <div className="flex items-center justify-center min-h-[calc(100vh-240px)] px-6">
            <Card className="max-w-md w-full">
              <CardContent className="pt-8 pb-8 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="text-7xl animate-bounce">💬</div>
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-primary">Пока нет сообщений</h2>
                  <p className="text-muted-foreground">
                    Когда у вас появятся мэтчи, вы сможете начать общение здесь
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/discovery')}
                  className="w-full"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Найти партнёров
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : filteredConversations.length === 0 && searchQuery ? (
          // No Search Results
          <div className="flex items-center justify-center min-h-[calc(100vh-240px)] px-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🔍</div>
              <p className="text-lg text-muted-foreground">
                Ничего не найдено по запросу "{searchQuery}"
              </p>
            </div>
          </div>
        ) : (
          // Conversations List
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
            {filteredConversations.map((conversation, index) => (
              <Card
                key={conversation.match_id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
                onClick={() => navigate(`/chat/${conversation.match_id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                        <AvatarImage
                          src={conversation.partner_photo}
                          alt={conversation.partner_name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                          {getInitials(conversation.partner_name)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread_count > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs animate-pulse"
                        >
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.partner_name}
                        </h3>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {conversation.last_message ? (
                          <>
                            {conversation.is_last_message_from_me && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="shrink-0"
                              >
                                <path
                                  d="M1 8L3.5 10.5L7 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground"
                                />
                                <path
                                  d="M5.5 8L8 10.5L11.5 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary"
                                />
                              </svg>
                            )}
                            <p
                              className={`text-sm truncate ${
                                conversation.unread_count > 0
                                  ? 'text-foreground font-semibold'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {conversation.last_message}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-primary italic flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Начните общение
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
