import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type UserProfile } from '../api/profile';
import { interestsApi, type UserInterest, type InterestCategory } from '../api/interests';
import BottomNav from '../components/Layout/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [allCategories, setAllCategories] = useState<InterestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioText, setBioText] = useState('');
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  // Drag & drop state
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
    loadInterests();
    loadAllCategories();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
      setBioText(data.bio || '');
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

  const loadAllCategories = async () => {
    try {
      const data = await interestsApi.getCategories();
      setAllCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleRemoveInterest = async (interestId: number) => {
    try {
      const interest = interests.find(i => i.id === interestId);
      if (!interest) return;

      await interestsApi.removeUserInterest(interest.category_id);
      setInterests(interests.filter(i => i.id !== interestId));
    } catch (err) {
      console.error('Error removing interest:', err);
      alert('Не удалось удалить интерес');
    }
  };

  const handleAddInterest = async (categoryId: number) => {
    try {
      // Check if already added
      if (interests.some(i => i.category_id === categoryId)) {
        return;
      }

      const category = allCategories.find(c => c.id === categoryId);
      if (!category) return;

      // Add interest via API
      const newInterest = await interestsApi.addUserInterest(categoryId);
      setInterests([...interests, newInterest]);
    } catch (err: any) {
      console.error('Error adding interest:', err);
      if (err.response?.data?.detail !== 'Interest already added') {
        alert('Не удалось добавить интерес');
      }
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

  const handlePhotoDelete = async (photoUrl: string) => {
    if (!profile) return;
    try {
      await profileApi.deletePhoto(photoUrl);
      setProfile({
        ...profile,
        photos: profile.photos.filter(p => p !== photoUrl)
      });
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      alert('Не удалось удалить фото');
    }
  };

  const handlePhotoDragStart = (index: number) => {
    setDraggedPhotoIndex(index);
  };

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedPhotoIndex === null || draggedPhotoIndex === index || !profile) return;

    const newPhotos = [...profile.photos];
    const draggedPhoto = newPhotos[draggedPhotoIndex];
    newPhotos.splice(draggedPhotoIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    setProfile({ ...profile, photos: newPhotos });
    setDraggedPhotoIndex(index);
  };

  const handlePhotoDragEnd = async () => {
    setDraggedPhotoIndex(null);

    // Save new photo order to backend
    if (!profile) return;
    try {
      await profileApi.reorderPhotos(profile.photos);
    } catch (err: any) {
      console.error('Error reordering photos:', err);
      alert('Не удалось сохранить порядок фото');
    }
  };

  const handleSaveBio = async () => {
    if (!profile) return;
    try {
      const updated = await profileApi.updateProfile({ bio: bioText });
      setProfile(updated);
      setShowBioModal(false);
    } catch (err: any) {
      console.error('Error updating bio:', err);
      alert('Не удалось обновить описание');
    }
  };

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
  const availableCategories = allCategories.filter(
    cat => !interests.some(int => int.category_id === cat.id)
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 mx-4">
            <div className="text-xs text-gray-400 mb-1.5 text-center">Заполнен на {completion}%</div>
            <div className="w-full bg-[#1A1A1A] rounded-full h-1">
              <div
                className="bg-gradient-to-r from-[#FF4458] to-[#FF6B7A] h-1 rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/preview')}
            className="px-3 py-1.5 text-sm text-[#FF4458] font-medium hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            Просмотр
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Interests Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Интересы</h2>
            <span className="text-xs text-[#FF4458] font-semibold">+12%</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <div
                key={interest.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full"
              >
                <span className="text-xs text-white">{interest.icon} {interest.name}</span>
                <button
                  onClick={() => handleRemoveInterest(interest.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowInterestsModal(true)}
              className="px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] border-dashed rounded-full text-xs text-gray-400 hover:border-[#3A3A3A] hover:text-gray-300 transition-colors"
            >
              + Добавить
            </button>
          </div>
        </div>

        {/* Photos Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Мои фото</h2>
            <span className="text-xs text-[#FF4458] font-semibold">+24%</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {profile.photos && profile.photos.length > 0 ? (
              <>
                {profile.photos.slice(0, 6).map((photo, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handlePhotoDragStart(index)}
                    onDragOver={(e) => handlePhotoDragOver(e, index)}
                    onDragEnd={handlePhotoDragEnd}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] cursor-move"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] text-white text-center font-medium">
                          Главное фото
                        </div>
                      </div>
                    )}
                    {index === 0 && (
                      <button className="absolute top-1 left-1 p-1 bg-black/70 backdrop-blur-sm rounded-full">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handlePhotoDelete(photo)}
                      className="absolute top-1 right-1 p-1 bg-black/70 backdrop-blur-sm rounded-full"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {profile.photos.length < 6 && (
                  <label className="aspect-square rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] border-dashed flex items-center justify-center cursor-pointer hover:border-[#3A3A3A] hover:bg-[#1F1F1F] transition-colors">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </>
            ) : (
              <>
                {[...Array(6)].map((_, index) => (
                  <label
                    key={index}
                    className="aspect-square rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] border-dashed flex items-center justify-center cursor-pointer hover:border-[#3A3A3A] hover:bg-[#1F1F1F] transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Био</h2>
            <span className="text-xs text-[#FF4458] font-semibold">+6%</span>
          </div>
          <button
            onClick={() => setShowBioModal(true)}
            className="w-full flex items-center gap-2.5 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-left hover:bg-[#1F1F1F] transition-colors"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">Расскажите о себе</div>
              {profile.bio && (
                <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{profile.bio}</div>
              )}
              {!profile.bio && (
                <div className="text-xs text-gray-500 mt-0.5">Заполненная анкета повышает шансы на мэтч!</div>
              )}
            </div>
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />

      {/* Bio Modal */}
      {showBioModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowBioModal(false)}>
          <div
            className="w-full bg-[#1A1A1A] rounded-t-3xl p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-2"></div>
            <h2 className="text-2xl font-bold text-white text-center">Расскажите немного о себе</h2>
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mb-2">Био</div>
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Расскажите о хобби, любимом рецепте, о том, что нравится (о суперсиле тоже можно)"
                className="w-full h-32 px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3A3A3A] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right">{bioText.length}/500</div>
            </div>
            <button
              onClick={handleSaveBio}
              className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Interests Modal */}
      {showInterestsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowInterestsModal(false)}>
          <div
            className="w-full bg-[#1A1A1A] rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-2"></div>
            <h2 className="text-2xl font-bold text-white text-center">Добавить интересы</h2>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleAddInterest(category.id);
                    setShowInterestsModal(false);
                  }}
                  className="px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-full text-sm text-white hover:border-[#3A3A3A] transition-colors"
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
