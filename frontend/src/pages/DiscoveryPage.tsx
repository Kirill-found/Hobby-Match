import { useState } from 'react';
import UserCard from '../components/UserCard';

// Моковые данные для тестирования
const MOCK_USERS = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    bio: 'Люблю активный отдых, играю в волейбол по выходным. Ищу компанию для походов в горы!',
    city: 'Москва',
    distance: 3,
    interests: [
      { name: 'Волейбол', icon: '🏐' },
      { name: 'Походы', icon: '🥾' },
      { name: 'Фотография', icon: '📸' },
    ],
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 28,
    bio: 'Программист и любитель настолок. Играем каждую пятницу, всегда рады новым людям!',
    city: 'Москва',
    distance: 5,
    interests: [
      { name: 'Настольные игры', icon: '🎲' },
      { name: 'Программирование', icon: '💻' },
      { name: 'Кино', icon: '🎬' },
    ],
  },
  {
    id: 3,
    name: 'Елена',
    age: 26,
    bio: 'Йога по утрам, танцы по вечерам. Хочу найти компанию для занятий йогой в парке.',
    city: 'Москва',
    distance: 2,
    interests: [
      { name: 'Йога', icon: '🧘' },
      { name: 'Танцы', icon: '💃' },
      { name: 'Медитация', icon: '🧘‍♀️' },
    ],
  },
  {
    id: 4,
    name: 'Максим',
    age: 30,
    bio: 'Футбол - моя страсть! Играем каждую субботу на поле возле метро. Присоединяйся!',
    city: 'Москва',
    distance: 7,
    interests: [
      { name: 'Футбол', icon: '⚽' },
      { name: 'Бег', icon: '🏃' },
      { name: 'Фитнес', icon: '💪' },
    ],
  },
];

export default function DiscoveryPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUser = users[currentIndex];

  const handleLike = () => {
    console.log('Liked user:', currentUser.id);
    // TODO: отправить лайк на сервер
    nextCard();
  };

  const handleDislike = () => {
    console.log('Disliked user:', currentUser.id);
    // TODO: отправить дизлайк на сервер
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Показать сообщение "Больше нет карточек"
      setUsers([]);
    }
  };

  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F8FA' }}
      >
        <div className="text-center px-6">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Вы посмотрели всех!
          </h2>
          <p className="text-gray-500 mb-8">
            Новые пользователи появятся совсем скоро
          </p>
          <button
            onClick={() => {
              setUsers(MOCK_USERS);
              setCurrentIndex(0);
            }}
            className="tinder-button"
          >
            Посмотреть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#F7F8FA' }}
    >
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Поиск партнеров
          </h1>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {users.length}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="fade-in">
        <UserCard
          user={currentUser}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </div>

      {/* Hint */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <p className="text-sm text-gray-400">
          Свайпните влево, чтобы пропустить, или вправо, чтобы лайкнуть
        </p>
      </div>
    </div>
  );
}
