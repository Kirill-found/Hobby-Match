import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest } from '../api/interests';
import BottomNav from '../components/Layout/BottomNav';
import Button from '../components/common/Button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadInterests();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInterests = async () => {
    try {
      const data = await interestsApi.getUserInterests();
      setInterests(data);
    } catch (err) {
      console.error('Error loading interests:', err);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 10;

    if (profile.photos && profile.photos.length > 0) completed += 3;
    if (profile.bio) completed += 2;
    if (interests.length >= 3) completed += 2;
    if (profile.city) completed += 1;
    if (profile.age) completed += 1;
    if (profile.gender) completed += 1;

    return Math.round((completed / total) * 100);
  };

  // Mock stats - replace with real API data
  const stats = {
    newMatches: profile?.total_meetings || 0,
    allMatches: 23, // Mock
    profileVisitors: 156, // Mock
    superLikes: 12, // Mock
    unreadMessages: 3, // Mock
    reliabilityScore: profile?.reliability_score || 0,
  };

  const completion = calculateCompletion();
  const level = Math.floor(completion / 10) + 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full animate-spin"
            style={{
              background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff 0)',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff 0)',
            }}
          />
          <p style={{ color: '#B4B4C8' }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center">
          <p className="text-lg mb-6" style={{ color: '#FF3B30' }}>
            Профиль не найден
          </p>
          <Button onClick={() => navigate('/discovery')} variant="primary">
            На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#0D1117' }}>
      {/* Top Navigation Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: 'transparent' }}
      >
        <button
          onClick={() => navigate('/discovery')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BFFF00">
            <path d="M3 12h18M3 12l9-9m-9 9l9 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BFFF00">
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
            <path d="M12 1v6m0 6v6M6.3 3.7l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M3.7 17.7l4.2-4.2m4.2-4.2l4.2-4.2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-4 pt-20 pb-6">
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
            boxShadow: '0 20px 60px rgba(191, 255, 0, 0.3)',
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
            style={{ backgroundColor: '#0D1117' }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: '#0D1117' }}
          />

          {/* Avatar */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full mb-4 border-4 overflow-hidden"
              style={{
                borderColor: '#0D1117',
                boxShadow: '0 8px 24px rgba(13, 17, 23, 0.4)',
              }}
            >
              {profile.photos && profile.photos.length > 0 ? (
                <img
                  src={profile.photos[0]}
                  alt={profile.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-5xl"
                  style={{ backgroundColor: '#0D1117' }}
                >
                  👤
                </div>
              )}
            </div>

            {/* Edit button on avatar */}
            <button
              onClick={() => navigate('/edit-profile')}
              className="absolute top-0 right-1/2 translate-x-14 translate-y-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#0D1117',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFFF00">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Name and verification */}
            <h1
              className="text-2xl font-bold mb-1 flex items-center gap-2"
              style={{
                color: '#0D1117',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {profile.first_name}
              {profile.age && <span>, {profile.age}</span>}
              {profile.total_meetings > 5 && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0D1117">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </h1>

            {/* City */}
            {profile.city && (
              <p className="text-sm mb-4" style={{ color: 'rgba(13, 17, 23, 0.7)' }}>
                📍 {profile.city}
              </p>
            )}

            {/* Progress and Level */}
            <div className="flex items-center gap-8 w-full justify-center mt-2">
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: '#0D1117',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {completion}%
                </div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'rgba(13, 17, 23, 0.6)' }}>
                  Профиль
                </div>
              </div>

              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(13, 17, 23, 0.15)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1117">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: '#0D1117',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {level}
                </div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'rgba(13, 17, 23, 0.6)' }}>
                  Уровень
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* New Matches */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(191, 255, 0, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#BFFF00">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.newMatches}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Новые матчи
                </div>
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 217, 255, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#00D9FF">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.unreadMessages}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Непрочитанные
                </div>
              </div>
            </div>
          </div>

          {/* All Matches */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(155, 81, 224, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9B51E0">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.allMatches}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Все матчи
                </div>
              </div>
            </div>
          </div>

          {/* Reliability Score */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.reliabilityScore.toFixed(1)}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Надежность
                </div>
              </div>
            </div>
          </div>

          {/* Profile Visitors */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 0, 107, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF006B">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.profileVisitors}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Просмотры
                </div>
              </div>
            </div>
          </div>

          {/* Super Likes */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stats.superLikes}
                </div>
                <div className="text-xs" style={{ color: '#B4B4C8' }}>
                  Супер лайки
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
