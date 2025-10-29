import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest } from '../api/interests';
import BottomNav from '../components/Layout/BottomNav';

const SKILL_LEVEL_COLORS = {
  'новичок': '#4CAF50',
  'любитель': '#2196F3',
  'продвинутый': '#FF9800',
  'профессионал': '#9C27B0',
};

const SKILL_LEVEL_ICONS = {
  'новичок': '🌱',
  'любитель': '🌟',
  'продвинутый': '🔥',
  'профессионал': '👑',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  useEffect(() => {
    loadProfile();
    loadInterests();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
      setEditedBio(data.bio || '');
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.response?.data?.detail || 'Не удалось загрузить профиль');
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

  const handleSaveBio = async () => {
    if (!profile) return;
    try {
      const updated = await profileApi.updateProfile({ bio: editedBio });
      setProfile(updated);
      setEditMode(false);
    } catch (err: any) {
      console.error('Error updating bio:', err);
      alert('Не удалось обновить описание');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await profileApi.uploadPhoto(file);
      await loadProfile(); // Reload to get updated photos
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert('Не удалось загрузить фото');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4458] mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Профиль не найден'}</p>
          <button
            onClick={() => navigate('/discovery')}
            className="px-6 py-2 bg-[#FF4458] text-white rounded-xl font-medium"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  const mainPhoto = profile.photos?.[0] || 'https://via.placeholder.com/400x400?text=No+Photo';
  const successRate = profile.total_meetings > 0
    ? Math.round((profile.successful_meetings / profile.total_meetings) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">Профиль</h1>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Main Photo & Info Card */}
        <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src={mainPhoto}
              alt={profile.first_name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-3xl font-bold text-white mb-1">
                {profile.first_name} {profile.last_name}, {profile.age || '—'}
              </h2>
              <div className="flex items-center gap-2 text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{profile.city || 'Город не указан'}</span>
              </div>
              {profile.is_premium && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-sm font-semibold text-white">
                  <span>⭐</span>
                  <span>Premium</span>
                </div>
              )}
            </div>
            {/* Upload Photo Button */}
            <label className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full cursor-pointer hover:bg-black/70 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Photo Gallery */}
          {profile.photos && profile.photos.length > 1 && (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.slice(1, 6).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {profile.photos.length < 6 && (
                  <label className="aspect-square rounded-lg bg-[#2A2A2A] flex items-center justify-center cursor-pointer hover:bg-[#333333] transition-colors">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Статистика</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FF4458] mb-1">
                {profile.total_meetings}
              </div>
              <div className="text-sm text-gray-400">Встреч</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4CAF50] mb-1">
                {successRate}%
              </div>
              <div className="text-sm text-gray-400">Успешных</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2196F3] mb-1">
                {Math.round(profile.reliability_score * 100)}%
              </div>
              <div className="text-sm text-gray-400">Надежность</div>
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">О себе</h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-[#FF4458] text-sm font-medium hover:text-[#ff5566] transition-colors"
              >
                Редактировать
              </button>
            )}
          </div>
          {editMode ? (
            <div className="space-y-3">
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Расскажите о себе..."
                className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4458] resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  className="flex-1 px-4 py-2 bg-[#FF4458] text-white rounded-xl font-medium hover:bg-[#ff5566] transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setEditedBio(profile.bio || '');
                    setEditMode(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#2A2A2A] text-white rounded-xl font-medium hover:bg-[#333333] transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed">
              {profile.bio || 'Пользователь пока не добавил описание'}
            </p>
          )}
        </div>

        {/* Interests Card */}
        {interests.length > 0 && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Интересы</h3>
              <button
                onClick={() => navigate('/interests')}
                className="text-[#FF4458] text-sm font-medium hover:text-[#ff5566] transition-colors"
              >
                Изменить
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => {
                const skillColor = interest.skill_level
                  ? SKILL_LEVEL_COLORS[interest.skill_level as keyof typeof SKILL_LEVEL_COLORS]
                  : '#666666';
                const skillIcon = interest.skill_level
                  ? SKILL_LEVEL_ICONS[interest.skill_level as keyof typeof SKILL_LEVEL_ICONS]
                  : '';

                return (
                  <div
                    key={interest.id}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
                    style={{
                      backgroundColor: `${skillColor}20`,
                      border: `1px solid ${skillColor}`,
                    }}
                  >
                    {interest.want_to_try ? (
                      <span>💭</span>
                    ) : (
                      skillIcon && <span>{skillIcon}</span>
                    )}
                    <span>{interest.icon} {interest.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferences Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Предпочтения</h3>
            <button
              onClick={() => navigate('/settings')}
              className="text-[#FF4458] text-sm font-medium hover:text-[#ff5566] transition-colors"
            >
              Изменить
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ищу</span>
              <span className="text-white font-medium">
                {profile.partner_gender_preference === 'male' ? 'Мужчину' :
                 profile.partner_gender_preference === 'female' ? 'Женщину' :
                 'Неважно'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Возраст</span>
              <span className="text-white font-medium">
                {profile.min_age || 18}—{profile.max_age || 60} лет
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Расстояние</span>
              <span className="text-white font-medium">
                до {profile.max_distance_km || 50} км
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
