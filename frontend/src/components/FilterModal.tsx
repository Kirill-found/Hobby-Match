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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #2A2A2A',
            position: 'sticky',
            top: 0,
            backgroundColor: '#1A1A1A',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#FFFFFF', margin: 0 }}>
              Фильтры
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#666666',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Age Range */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '12px', display: 'block' }}>
              Возраст: {minAge} - {maxAge} лет
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input
                type="range"
                min="18"
                max="60"
                value={minAge}
                onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  background: `linear-gradient(to right, #FF4458 0%, #FF4458 ${((minAge - 18) / 42) * 100}%, #2A2A2A ${((minAge - 18) / 42) * 100}%, #2A2A2A 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              />
              <input
                type="range"
                min="18"
                max="60"
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  background: `linear-gradient(to right, #FF4458 0%, #FF4458 ${((maxAge - 18) / 42) * 100}%, #2A2A2A ${((maxAge - 18) / 42) * 100}%, #2A2A2A 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              />
            </div>
          </div>

          {/* Distance */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '12px', display: 'block' }}>
              Расстояние: до {maxDistance} км
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                outline: 'none',
                background: `linear-gradient(to right, #FF4458 0%, #FF4458 ${maxDistance}%, #2A2A2A ${maxDistance}%, #2A2A2A 100%)`,
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '12px', display: 'block' }}>
              Хобби {selectedInterests.length > 0 && `(${selectedInterests.length})`}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interests.slice(0, 20).map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: selectedInterests.includes(interest.id) ? '#FF4458' : '#2A2A2A',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{interest.icon}</span>
                  <span>{interest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #2A2A2A',
            display: 'flex',
            gap: '12px',
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#1A1A1A',
          }}
        >
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #2A2A2A',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Сбросить
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#FF4458',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
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
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
