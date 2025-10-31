import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest } from '../api/interests';
import Button from '../components/common/Button';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    bio: '',
    city: '',
    partner_gender_preference: '',
    max_distance_km: 10,
    min_age: 18,
    max_age: 35,
    availability: [] as string[],
  });

  useEffect(() => {
    loadProfile();
    loadInterests();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);

      // Populate form with existing data
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        age: data.age?.toString() || '',
        gender: data.gender || '',
        bio: data.bio || '',
        city: data.city || '',
        partner_gender_preference: data.partner_gender_preference || 'any',
        max_distance_km: data.max_distance_km || 10,
        min_age: data.min_age || 18,
        max_age: data.max_age || 35,
        availability: data.availability || [],
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInterests = async () => {
    try {
      const data = await interestsApi.getUserInterests();
      setInterests(data);
    } catch (error) {
      console.error('Failed to load interests:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {
        first_name: formData.first_name,
        last_name: formData.last_name || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        bio: formData.bio || undefined,
        city: formData.city || undefined,
        partner_gender_preference: formData.partner_gender_preference || undefined,
        max_distance_km: formData.max_distance_km,
        min_age: formData.min_age,
        max_age: formData.max_age,
        availability: formData.availability,
      };

      await profileApi.updateProfile(updates);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Ошибка при сохранении профиля');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot],
    }));
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0D1117' }}
      >
        <div className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: '#BFFF00',
            borderTopColor: 'transparent',
          }}
        />
      </div>
    );
  }

  const availabilitySlots = [
    { id: 'weekday_morning', label: 'Будни утром' },
    { id: 'weekday_afternoon', label: 'Будни днем' },
    { id: 'weekday_evening', label: 'Будни вечером' },
    { id: 'weekend_morning', label: 'Выходные утром' },
    { id: 'weekend_afternoon', label: 'Выходные днем' },
    { id: 'weekend_evening', label: 'Выходные вечером' },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: '#0D1117' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(13, 17, 23, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#161B22' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h1
          className="text-lg font-bold"
          style={{
            color: '#FFFFFF',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Редактировать профиль
        </h1>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #BFFF00 0%, #A3E000 100%)',
            color: '#0D1117',
          }}
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">

        {/* Basic Info Section */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Основная информация
          </h2>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Имя *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                }}
                placeholder="Введите имя"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Фамилия
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                }}
                placeholder="Введите фамилию"
              />
            </div>

            {/* Age */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Возраст *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="18"
                max="100"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                }}
                placeholder="18"
              />
            </div>

            {/* Gender */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Пол *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleInputChange('gender', gender)}
                    className="px-4 py-3 rounded-xl font-semibold transition-all"
                    style={{
                      backgroundColor: formData.gender === gender ? '#BFFF00' : '#0D1117',
                      color: formData.gender === gender ? '#0D1117' : '#B4B4C8',
                      border: `1px solid ${formData.gender === gender ? '#BFFF00' : 'rgba(255, 255, 255, 0.08)'}`,
                    }}
                  >
                    {gender === 'male' ? 'Мужской' : 'Женский'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                О себе
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                }}
                placeholder="Расскажите о себе..."
              />
              <div
                className="text-xs mt-1 text-right"
                style={{ color: '#6E6E8F' }}
              >
                {formData.bio.length}/500
              </div>
            </div>

            {/* City */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Город *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                }}
                placeholder="Москва"
              />
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Фотографии
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {profile?.photos?.map((photo, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden relative"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: '#BFFF00',
                      color: '#0D1117',
                    }}
                  >
                    Главное
                  </div>
                )}
              </div>
            ))}

            {/* Add Photo Button */}
            {(!profile?.photos || profile.photos.length < 6) && (
              <button
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{
                  backgroundColor: '#0D1117',
                  border: '2px dashed rgba(191, 255, 0, 0.3)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 8V24M8 16H24" stroke="#BFFF00" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span
                  className="text-xs font-semibold"
                  style={{ color: '#BFFF00' }}
                >
                  Добавить
                </span>
              </button>
            )}
          </div>

          <p
            className="text-xs mt-3"
            style={{ color: '#6E6E8F' }}
          >
            Первая фотография будет главной. Максимум 6 фото.
          </p>
        </div>

        {/* Interests Section */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Интересы
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {interests.map((interest) => (
              <div
                key={interest.id}
                className="px-4 py-2 rounded-xl flex items-center gap-2"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>{interest.icon}</span>
                <span
                  className="text-sm"
                  style={{ color: '#FFFFFF' }}
                >
                  {interest.name}
                </span>
                <button
                  className="ml-2"
                  style={{ color: '#6E6E8F' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {/* TODO: Implement interest selector */}}
            className="w-full py-3 rounded-xl font-semibold"
            style={{
              backgroundColor: '#0D1117',
              border: '2px dashed rgba(191, 255, 0, 0.3)',
              color: '#BFFF00',
            }}
          >
            + Добавить интерес
          </Button>
        </div>

        {/* Availability Section */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Когда готовы встречаться?
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {availabilitySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => toggleAvailability(slot.id)}
                className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: formData.availability.includes(slot.id) ? '#BFFF00' : '#0D1117',
                  color: formData.availability.includes(slot.id) ? '#0D1117' : '#B4B4C8',
                  border: `1px solid ${formData.availability.includes(slot.id) ? '#BFFF00' : 'rgba(255, 255, 255, 0.08)'}`,
                }}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Preferences Section */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Настройки поиска
          </h2>

          <div className="space-y-4">
            {/* Partner Gender */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Кого ищете?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'male', label: 'Мужчин' },
                  { value: 'female', label: 'Женщин' },
                  { value: 'any', label: 'Всех' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('partner_gender_preference', option.value)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: formData.partner_gender_preference === option.value ? '#BFFF00' : '#0D1117',
                      color: formData.partner_gender_preference === option.value ? '#0D1117' : '#B4B4C8',
                      border: `1px solid ${formData.partner_gender_preference === option.value ? '#BFFF00' : 'rgba(255, 255, 255, 0.08)'}`,
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Возраст: {formData.min_age} - {formData.max_age} лет
              </label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={formData.min_age}
                  onChange={(e) => handleInputChange('min_age', parseInt(e.target.value))}
                  className="flex-1"
                  style={{
                    accentColor: '#BFFF00',
                  }}
                />
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={formData.max_age}
                  onChange={(e) => handleInputChange('max_age', parseInt(e.target.value))}
                  className="flex-1"
                  style={{
                    accentColor: '#BFFF00',
                  }}
                />
              </div>
            </div>

            {/* Distance */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: '#B4B4C8' }}
              >
                Максимальное расстояние: {formData.max_distance_km} км
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={formData.max_distance_km}
                onChange={(e) => handleInputChange('max_distance_km', parseInt(e.target.value))}
                className="w-full"
                style={{
                  accentColor: '#BFFF00',
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
