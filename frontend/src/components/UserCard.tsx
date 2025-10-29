interface UserCardProps {
  user: {
    id: number;
    name: string;
    age: number;
    bio: string;
    city?: string;
    interests: Array<{ name: string; icon: string }>;
    distance?: number;
    photos?: string[];
  };
  onLike: () => void;
  onDislike: () => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Photo/Avatar */}
        <div className="relative h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          {user.photos && user.photos.length > 0 ? (
            <img
              src={user.photos[0]}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-9xl">👤</div>
          )}

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Name and age */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-1">
              {user.name}, {user.age}
            </h2>
            {user.city && (
              <p className="text-white/90 flex items-center gap-1">
                📍 {user.city}
                {user.distance && ` • ${user.distance} км`}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Bio */}
          {user.bio && (
            <div>
              <p className="text-gray-700 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="interest-chip text-sm"
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={onDislike}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform border-2 border-gray-200"
          aria-label="Dislike"
        >
          ❌
        </button>
        <button
          onClick={onLike}
          className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-3xl hover:scale-110 transition-transform"
          style={{ background: '#6C63FF', color: 'white' }}
          aria-label="Like"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
