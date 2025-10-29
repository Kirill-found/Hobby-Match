import { useState } from 'react';
import { locationApi } from '../api/location';
import type { CityGeocodeResponse } from '../api/location';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected: (city: string, latitude: number, longitude: number) => void;
  currentCity?: string;
}

export default function LocationPicker({ isOpen, onClose, onLocationSelected, currentCity }: LocationPickerProps) {
  const [cityInput, setCityInput] = useState(currentCity || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocodedResult, setGeocodedResult] = useState<CityGeocodeResponse | null>(null);

  if (!isOpen) return null;

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Request browser geolocation
      const position = await locationApi.requestBrowserLocation();
      const { latitude, longitude } = position.coords;

      // Reverse geocode to get city name
      // Note: We'll save coordinates directly, city can be inferred or manually set
      onLocationSelected('', latitude, longitude);
      onClose();
    } catch (err: any) {
      console.error('Geolocation error:', err);
      setError('Не удалось определить ваше местоположение. Попробуйте ввести город вручную.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCity = async () => {
    if (!cityInput.trim()) {
      setError('Введите название города');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await locationApi.geocodeCity({ city: cityInput });
      setGeocodedResult(result);
      setError(null);
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setError('Город не найден. Попробуйте другое название.');
      setGeocodedResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCity = () => {
    if (geocodedResult) {
      onLocationSelected(geocodedResult.city, geocodedResult.latitude, geocodedResult.longitude);
      onClose();
    }
  };

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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          padding: '24px',
          animation: 'scaleIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFFFFF', margin: 0 }}>
              📍 Ваше местоположение
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#666666',
                fontSize: '28px',
                cursor: 'pointer',
                padding: 0,
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </div>
          <p style={{ color: '#999999', fontSize: '14px', marginTop: '8px' }}>
            Это поможет найти людей рядом с вами
          </p>
        </div>

        {/* Auto-detect button */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #2A2A2A',
            backgroundColor: '#2A2A2A',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
        >
          <span>🎯</span>
          {loading ? 'Определяем...' : 'Определить автоматически'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#2A2A2A' }} />
          <span style={{ color: '#666666', padding: '0 12px', fontSize: '14px' }}>или</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#2A2A2A' }} />
        </div>

        {/* Manual city input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px', display: 'block' }}>
            Введите город
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchCity()}
              placeholder="Например, Москва"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #2A2A2A',
                backgroundColor: '#0F0F0F',
                color: '#FFFFFF',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSearchCity}
              disabled={loading || !cityInput.trim()}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#FF4458',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !cityInput.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !cityInput.trim() ? 0.5 : 1,
              }}
            >
              🔍
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 68, 88, 0.1)',
            border: '1px solid rgba(255, 68, 88, 0.3)',
            color: '#FF4458',
            fontSize: '14px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {/* Geocoded result */}
        {geocodedResult && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#2A2A2A',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {geocodedResult.city}, {geocodedResult.country}
            </div>
            <div style={{ color: '#999999', fontSize: '14px', marginBottom: '12px' }}>
              {geocodedResult.display_name}
            </div>
            <button
              onClick={handleConfirmCity}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FF4458',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Подтвердить
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
