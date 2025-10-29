import apiClient from './client';

export interface LocationUpdate {
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface CityGeocodeRequest {
  city: string;
  country?: string;
}

export interface CityGeocodeResponse {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  display_name: string;
}

export const locationApi = {
  // Update user location
  updateLocation: async (location: LocationUpdate): Promise<{message: string; city?: string; latitude?: number; longitude?: number}> => {
    const response = await apiClient.put('/users/location', location);
    return response.data;
  },

  // Geocode city name to coordinates
  geocodeCity: async (request: CityGeocodeRequest): Promise<CityGeocodeResponse> => {
    const response = await apiClient.post<CityGeocodeResponse>('/users/location/geocode', request);
    return response.data;
  },

  // Request browser geolocation
  requestBrowserLocation: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },
};
