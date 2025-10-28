import { useUserStore } from '../store/userStore';

export default function DiscoveryPage() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-telegram-bg p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-telegram-text mb-6">
          Поиск партнеров
        </h1>

        <div className="bg-telegram-secondaryBg p-8 rounded-2xl text-center">
          <p className="text-telegram-hint mb-4">
            Discovery функционал будет добавлен в следующей итерации
          </p>
          <p className="text-sm text-telegram-hint">
            Привет, {user?.first_name}! 👋
          </p>
        </div>
      </div>
    </div>
  );
}
