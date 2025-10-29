import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest } from '../api/interests';
import BottomNav from '../components/Layout/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    loadInterests();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
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

  const handleRemoveInterest = async (interestId: number) => {
    try {
      // TODO: Implement delete interest API call
      setInterests(interests.filter(i => i.id !== interestId));
    } catch (err) {
      console.error('Error removing interest:', err);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await profileApi.uploadPhoto(file);
      await loadProfile();
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert('Не удалось загрузить фото');
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 10;

    if (profile.photos && profile.photos.length > 0) completed += 3;
    if (profile.bio) completed += 1;
    if (interests.length > 0) completed += 2;
    if (profile.city) completed += 1;
    if (profile.age) completed += 1;
    if (profile.gender) completed += 1;
    if (profile.partner_gender_preference) completed += 1;

    return Math.round((completed / total) * 100);
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

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <div className="text-sm text-gray-400 mb-1">Заполнен на {completion}%</div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#FF4458] to-[#FF6B7A] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/discovery')}
            className="px-4 py-2 text-[#FF4458] font-medium hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            Просмотр
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Interests Section */}
        {interests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Интересы</h2>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <div
                  key={interest.id}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-white hover:border-[#3A3A3A] transition-colors"
                >
                  <span>{interest.icon} {interest.name}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest.id)}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Info Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Основные</h2>
            <span className="text-sm text-[#FF4458] font-semibold">+4%</span>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {/* TODO: Open city modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Город</div>
                <div className="text-base text-white font-medium">{profile.city || 'Не указан'}</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open worldview modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Мировоззрение</div>
                <div className="text-base text-white font-medium">Не указано</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open zodiac modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <span className="text-2xl">♓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Знак зодиака</div>
                <div className="text-base text-white font-medium">Не отображать</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open height modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm0 5a1 1 0 000 2h10a1 1 0 100-2H5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Рост</div>
                <div className="text-base text-white font-medium">Не указан</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open education modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Образование</div>
                <div className="text-base text-white font-medium">Не указано</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open children modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <span className="text-2xl">🧸</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Дети</div>
                <div className="text-base text-white font-medium">Нет</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open languages modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.490 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Языки</div>
                <div className="text-base text-white font-medium">Не указаны</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open alcohol modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <span className="text-2xl">🍷</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Алкоголь</div>
                <div className="text-base text-white font-medium">Не указано</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {/* TODO: Open smoking modal */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <span className="text-2xl">🚬</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Курение</div>
                <div className="text-base text-white font-medium">Не указано</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Photos Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Мои фото</h2>
            <span className="text-sm text-[#FF4458] font-semibold">+24%</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {profile.photos && profile.photos.length > 0 ? (
              <>
                {profile.photos.slice(0, 6).map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white text-center">
                          Главное фото
                        </div>
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {profile.photos.length < 6 && (
                  <label className="aspect-square rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] border-dashed flex items-center justify-center cursor-pointer hover:border-[#3A3A3A] hover:bg-[#222222] transition-colors">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </>
            ) : (
              <>
                {[...Array(6)].map((_, index) => (
                  <label
                    key={index}
                    className="aspect-square rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] border-dashed flex items-center justify-center cursor-pointer hover:border-[#3A3A3A] hover:bg-[#222222] transition-colors"
                  >
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                ))}
              </>
            )}
          </div>
          {profile.photos && profile.photos.length > 0 && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Перетащите, чтобы изменить порядок
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Био</h2>
            <span className="text-sm text-[#FF4458] font-semibold">+6%</span>
          </div>
          <button
            onClick={() => navigate('/bio')}
            className="w-full flex items-center gap-4 px-5 py-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
          >
            <div className="p-2 bg-[#2A2A2A] rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white mb-1">Расскажите о себе</div>
              <div className="text-sm text-gray-400">
                {profile.bio || 'Заполненная анкета повышает шансы на мэтч!'}
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Work Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Сфера работы</h2>
            <span className="text-sm text-gray-500 font-semibold">+0%</span>
          </div>
          <button
            onClick={() => {/* TODO: Open work modal */}}
            className="w-full flex items-center gap-4 px-5 py-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
          >
            <div className="p-2 bg-[#2A2A2A] rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white mb-1">Добавьте сферу деятельности</div>
              <div className="text-sm text-gray-400">Увеличьте шансы на идеальный мэтч</div>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* More About You Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Больше о вас</h2>
            <span className="text-sm text-gray-500 font-semibold">+2%</span>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {/* TODO */}}
              className="w-full flex items-center gap-4 px-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-left hover:border-[#3A3A3A] transition-colors group"
            >
              <div className="p-2 bg-[#2A2A2A] rounded-lg">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Любимая музыка</div>
                <div className="text-base text-white font-medium">Не указана</div>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
