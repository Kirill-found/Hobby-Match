// User types
export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  age?: number;
  gender?: string;
  bio?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  availability: string[];
  partner_gender_preference?: string;
  max_distance_km?: number;
  min_age?: number;
  max_age?: number;
  is_premium: boolean;
  reliability_score: number;
  total_meetings: number;
  successful_meetings: number;
  onboarding_completed: boolean;
  created_at: string;
  last_active: string;
}

// Interest types
export interface Interest {
  id: number;
  category_id: number;
  name: string;
  icon?: string;
  skill_level?: string;
  want_to_try: boolean;
}

export interface InterestCategory {
  id: number;
  name: string;
  icon?: string;
  level: number;
  parent_id?: number;
  children?: InterestCategory[];
}

// Match types
export interface Match {
  match_id: number;
  created_at: string;
  partner: {
    user_id: number;
    name: string;
    age?: number;
    photo?: string;
  };
  last_message?: {
    text: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
}

// Message types
export interface Message {
  id: number;
  sender_id: number;
  text: string;
  is_read: boolean;
  created_at: string;
}

// Discovery card
export interface DiscoveryCard {
  user_id: number;
  name: string;
  age?: number;
  photos: string[];
  bio?: string;
  common_interests: Array<{
    id: number;
    name: string;
    icon?: string;
    my_skill_level?: string;
    their_skill_level?: string;
  }>;
  distance_km?: number;
  reliability_score: number;
  is_verified: boolean;
}

// Auth types
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Telegram WebApp types
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  platform: string;
  colorScheme: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
