import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest } from '../api/interests';
import { getPhotoUrl } from '../api/client';
import Button from '../components/common/Button';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  // Interest selector modal state - supports up to 4 levels
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [navigationStack, setNavigationStack] = useState<any[]>([]); // Stack of selected categories
  const [currentLevelCategories, setCurrentLevelCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);

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
      setPhotos(data.photos || []);

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

  // Photo management functions
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    setUploading(true);
    try {
      const response = await profileApi.uploadPhoto(file);
      setPhotos(prev => [...prev, response.photo_url]);

      // Refresh profile to get updated photos
      const updatedProfile = await profileApi.getProfile();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Ошибка при загрузке фото');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (photoUrl: string) => {
    if (!confirm('Удалить эту фотографию?')) return;

    try {
      await profileApi.deletePhoto(photoUrl);
      setPhotos(prev => prev.filter(url => url !== photoUrl));

      // Update profile state
      if (profile) {
        setProfile({
          ...profile,
          photos: profile.photos.filter(url => url !== photoUrl),
        });
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Ошибка при удалении фото');
    }
  };

  const handlePhotoReorder = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(newPhotos);
  };

  const savePhotoOrder = async () => {
    try {
      await profileApi.reorderPhotos(photos);
    } catch (error) {
      console.error('Failed to reorder photos:', error);
      alert('Ошибка при изменении порядка фото');
    }
  };

  // Interest management functions - dynamic level support
  const loadCategoriesForLevel = async (level: number, parentId?: number) => {
    try {
      const categories = await interestsApi.getCategories(level, parentId);
      return categories;
    } catch (error) {
      console.error(`Failed to load level ${level} categories:`, error);
      return [];
    }
  };

  const handleAddInterestClick = async () => {
    setShowInterestModal(true);
    setNavigationStack([]);
    setSelectedCategory(null);
    setSelectedSkillLevel(null);

    // Load level 1 categories
    const level1 = await loadCategoriesForLevel(1);
    setCurrentLevelCategories(level1);
  };

  const handleCategorySelect = async (category: any) => {
    // Check if this category has children
    const nextLevel = category.level + 1;
    const children = await loadCategoriesForLevel(nextLevel, category.id);

    if (children.length > 0) {
      // Has children - navigate deeper
      setNavigationStack(prev => [...prev, category]);
      setCurrentLevelCategories(children);
      setSelectedCategory(null);
      setSelectedSkillLevel(null);
    } else {
      // No children - this is a leaf category, select it
      setSelectedCategory(category);
      setSelectedSkillLevel(null);
    }
  };

  const handleNavigateBack = async () => {
    if (navigationStack.length === 0) return;

    const newStack = [...navigationStack];
    newStack.pop();
    setNavigationStack(newStack);
    setSelectedCategory(null);
    setSelectedSkillLevel(null);

    if (newStack.length === 0) {
      // Back to level 1
      const level1 = await loadCategoriesForLevel(1);
      setCurrentLevelCategories(level1);
    } else {
      // Load children of the last item in stack
      const parent = newStack[newStack.length - 1];
      const children = await loadCategoriesForLevel(parent.level + 1, parent.id);
      setCurrentLevelCategories(children);
    }
  };

  const handleAddInterest = async () => {
    if (!selectedCategory || !selectedSkillLevel) {
      alert('Выберите интерес и уровень навыка');
      return;
    }

    try {
      const newInterest = await interestsApi.addUserInterest(
        selectedCategory.id,
        selectedSkillLevel,
        false
      );
      setInterests(prev => [...prev, newInterest]);
      setShowInterestModal(false);
      setNavigationStack([]);
      setSelectedCategory(null);
      setSelectedSkillLevel(null);
    } catch (error: any) {
      console.error('Failed to add interest:', error);
      alert(error.response?.data?.detail || 'Ошибка при добавлении интереса');
    }
  };

  const handleRemoveInterest = async (categoryId: number) => {
    try {
      await interestsApi.removeUserInterest(categoryId);
      setInterests(prev => prev.filter(i => i.category_id !== categoryId));
    } catch (error) {
      console.error('Failed to remove interest:', error);
      alert('Ошибка при удалении интереса');
    }
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
            {photos.map((photo, index) => (
              <div
                key={photo}
                className="aspect-square rounded-2xl overflow-hidden relative group"
                style={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <img
                  src={getPhotoUrl(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Main photo badge */}
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

                {/* Delete button */}
                <button
                  onClick={() => handlePhotoDelete(photo)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M4 12L12 4" stroke="#FF4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Reorder buttons */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      onClick={() => {
                        handlePhotoReorder(index, index - 1);
                        savePhotoOrder();
                      }}
                      className="flex-1 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(13, 17, 23, 0.9)',
                        color: '#BFFF00',
                      }}
                    >
                      ←
                    </button>
                  )}
                  {index < photos.length - 1 && (
                    <button
                      onClick={() => {
                        handlePhotoReorder(index, index + 1);
                        savePhotoOrder();
                      }}
                      className="flex-1 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(13, 17, 23, 0.9)',
                        color: '#BFFF00',
                      }}
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Photo Button */}
            {photos.length < 6 && (
              <label
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-lime-400 transition-colors"
                style={{
                  backgroundColor: '#0D1117',
                  border: uploading ? '2px solid #BFFF00' : '2px dashed rgba(191, 255, 0, 0.3)',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-4 rounded-full animate-spin"
                      style={{
                        borderColor: '#BFFF00',
                        borderTopColor: 'transparent',
                      }}
                    />
                    <span className="text-xs font-semibold" style={{ color: '#BFFF00' }}>
                      Загрузка...
                    </span>
                  </>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 8V24M8 16H24" stroke="#BFFF00" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#BFFF00' }}>
                      Добавить
                    </span>
                  </>
                )}
              </label>
            )}
          </div>

          <p
            className="text-xs mt-3"
            style={{ color: '#6E6E8F' }}
          >
            Первая фотография будет главной. Максимум 6 фото. Нажмите на фото чтобы увидеть кнопки управления.
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
                <div className="flex flex-col">
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#FFFFFF' }}
                  >
                    {interest.name}
                  </span>
                  {interest.skill_level && (
                    <span
                      className="text-xs"
                      style={{ color: '#BFFF00' }}
                    >
                      {interest.skill_level}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveInterest(interest.category_id)}
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
            onClick={handleAddInterestClick}
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

      {/* Interest Selector Modal */}
      {showInterestModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
          onClick={() => setShowInterestModal(false)}
        >
          <div
            className="rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: '#161B22',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-bold"
                style={{
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Добавить интерес
              </h2>
              <button
                onClick={() => setShowInterestModal(false)}
                style={{ color: '#6E6E8F' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Breadcrumb navigation */}
            {navigationStack.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: '#B4B4C8' }}>
                {navigationStack.map((cat, idx) => (
                  <span key={cat.id}>
                    {cat.icon} {cat.name}
                    {idx < navigationStack.length - 1 && <span className="mx-2">→</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Category selection - works for any level */}
            {!selectedCategory && (
              <div>
                {/* Back button */}
                {navigationStack.length > 0 && (
                  <button
                    onClick={handleNavigateBack}
                    className="flex items-center gap-2 mb-4"
                    style={{ color: '#BFFF00' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium">Назад</span>
                  </button>
                )}

                <p className="text-sm mb-4" style={{ color: '#B4B4C8' }}>
                  {navigationStack.length === 0 ? 'Выберите категорию:' : 'Выберите интерес:'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {currentLevelCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="p-4 rounded-xl flex flex-col items-center gap-2 hover:border-lime-400 transition-colors"
                      style={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <span className="text-3xl">{category.icon}</span>
                      <span className="text-sm font-medium text-center" style={{ color: '#FFFFFF' }}>
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skill level selection */}
            {selectedCategory && (
              <div>
                <button
                  onClick={handleNavigateBack}
                  className="flex items-center gap-2 mb-4"
                  style={{ color: '#BFFF00' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-medium">Назад</span>
                </button>

                <div className="mb-6 p-4 rounded-xl text-center" style={{ backgroundColor: '#0D1117' }}>
                  <span className="text-3xl mb-2 block">{selectedCategory.icon}</span>
                  <span className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                    {selectedCategory.name}
                  </span>
                </div>

                <p className="text-sm mb-4" style={{ color: '#B4B4C8' }}>
                  Выберите уровень навыка:
                </p>
                <div className="space-y-3">
                  {['новичок', 'любитель', 'продвинутый', 'профессионал'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedSkillLevel(level)}
                      className="w-full p-4 rounded-xl font-medium transition-all"
                      style={{
                        backgroundColor: selectedSkillLevel === level ? '#BFFF00' : '#0D1117',
                        border: selectedSkillLevel === level ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: selectedSkillLevel === level ? '#0D1117' : '#FFFFFF',
                      }}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>

                {selectedSkillLevel && (
                  <Button
                    onClick={handleAddInterest}
                    className="w-full mt-6 py-3 rounded-xl font-semibold"
                    style={{
                      backgroundColor: '#BFFF00',
                      color: '#0D1117',
                    }}
                  >
                    Добавить
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
