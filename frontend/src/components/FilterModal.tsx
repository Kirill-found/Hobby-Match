import { useState, useEffect } from 'react';
import type { DiscoveryFilters } from '../api/discovery';

interface Interest {
  id: number;
  name: string;
  icon: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: DiscoveryFilters) => void;
  currentFilters: DiscoveryFilters;
  interests: Interest[];
}

export default function FilterModal({ isOpen, onClose, onApply, currentFilters, interests }: FilterModalProps) {
  const [minAge, setMinAge] = useState(currentFilters.minAge || 18);
  const [maxAge, setMaxAge] = useState(currentFilters.maxAge || 60);
  const [maxDistance, setMaxDistance] = useState(currentFilters.maxDistance || 50);
  const [selectedInterests, setSelectedInterests] = useState<number[]>(currentFilters.selectedInterests || []);

  useEffect(() => {
    if (isOpen) {
      setMinAge(currentFilters.minAge || 18);
      setMaxAge(currentFilters.maxAge || 60);
      setMaxDistance(currentFilters.maxDistance || 50);
      setSelectedInterests(currentFilters.selectedInterests || []);
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply({
      minAge,
      maxAge,
      maxDistance,
      selectedInterests,
    });
    onClose();
  };

  const handleReset = () => {
    setMinAge(18);
    setMaxAge(60);
    setMaxDistance(50);
    setSelectedInterests([]);
  };

  const toggleInterest = (interestId: number) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-auto"
        style={{
          backgroundColor: '#1A1A22',
          borderRadius: '24px 24px 0 0',
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
          style={{
            backgroundColor: '#1A1A22',
            borderBottom: '1px solid rgba(200, 115, 255, 0.1)',
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: '#FFF' }}>Фильтры</h2>
          <button
            onClick={onClose}
            className="text-3xl leading-none"
            style={{
              background: 'none',
              border: 'none',
              color: '#B7B7C3',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#B7B7C3'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Age Range */}
          <div className="mb-8">
            <label className="block text-base font-bold mb-4" style={{ color: '#FFF' }}>
              Возраст: {minAge} - {maxAge} лет
            </label>
            <div className="relative h-2 mt-4 mb-4">
              {/* Track background */}
              <div className="absolute top-0 left-0 right-0 h-2 rounded-full" style={{
                backgroundColor: '#232329',
              }} />

              {/* Active track */}
              <div className="absolute top-0 h-2 rounded-full" style={{
                left: `${((minAge - 18) / 42) * 100}%`,
                right: `${100 - ((maxAge - 18) / 42) * 100}%`,
                background: 'linear-gradient(90deg, #C873FF 0%, #4E9EFF 100%)',
                pointerEvents: 'none',
              }} />

              {/* Min slider */}
              <input
                type="range"
                min="18"
                max="60"
                value={minAge}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < maxAge - 1) {
                    setMinAge(value);
                  }
                }}
                className="absolute w-full top-[-5px] left-0 bg-transparent pointer-events-auto"
                style={{
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  zIndex: minAge > maxAge - 5 ? 5 : 3,
                  margin: 0,
                  padding: 0,
                }}
              />

              {/* Max slider */}
              <input
                type="range"
                min="18"
                max="60"
                value={maxAge}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > minAge + 1) {
                    setMaxAge(value);
                  }
                }}
                className="absolute w-full top-[-5px] left-0 bg-transparent pointer-events-auto"
                style={{
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  zIndex: 4,
                  margin: 0,
                  padding: 0,
                }}
              />
            </div>
          </div>

          {/* Distance */}
          <div className="mb-8">
            <label className="block text-base font-bold mb-4" style={{ color: '#FFF' }}>
              Расстояние: до {maxDistance} км
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full h-2 rounded-full outline-none"
              style={{
                background: `linear-gradient(to right, #4E9EFF 0%, #4E9EFF ${maxDistance}%, #232329 ${maxDistance}%, #232329 100%)`,
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-base font-bold mb-4" style={{ color: '#FFF' }}>
              Хобби {selectedInterests.length > 0 && <span style={{ color: '#C873FF' }}>({selectedInterests.length})</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 20).map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                    style={{
                      backgroundColor: isSelected ? '#C873FF' : '#232329',
                      color: '#FFF',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(200, 115, 255, 0.25)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#2C2C34';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#232329';
                      }
                    }}
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex gap-3 px-6 py-5"
          style={{
            backgroundColor: '#1A1A22',
            borderTop: '1px solid rgba(200, 115, 255, 0.1)',
          }}
        >
          <button
            onClick={handleReset}
            className="flex-1 h-12 rounded-full font-bold text-base"
            style={{
              backgroundColor: '#232329',
              color: '#FFF',
              border: '1px solid rgba(200, 115, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2C2C34';
              e.currentTarget.style.borderColor = 'rgba(200, 115, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#232329';
              e.currentTarget.style.borderColor = 'rgba(200, 115, 255, 0.2)';
            }}
          >
            Сбросить
          </button>
          <button
            onClick={handleApply}
            className="flex-[2] h-12 rounded-full font-bold text-base"
            style={{
              background: 'linear-gradient(135deg, #C873FF 0%, #4E9EFF 100%)',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(200, 115, 255, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 28px rgba(200, 115, 255, 0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(200, 115, 255, 0.25)'}
          >
            Применить
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(200, 115, 255, 0.4);
          position: relative;
          z-index: 10;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(200, 115, 255, 0.4);
          position: relative;
          z-index: 10;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"]::-webkit-slider-runnable-track {
          background: transparent;
          height: 8px;
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 8px;
        }
      `}</style>
    </div>
  );
}
