import { calculateDistanceKm } from './distance';
import { getFallbackHemocenters } from '../constants/mockData';

const PLACES_RADIUS_METERS = 30000;
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

function normalizePlace(place, userLocation) {
  const latitude = place.geometry?.location?.lat;
  const longitude = place.geometry?.location?.lng;
  return {
    id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || 'Endereço não informado',
    latitude,
    longitude,
    distanceKm: calculateDistanceKm(userLocation, { latitude, longitude }),
    hours: place.opening_hours ? 'Horário informado pelo Google Places' : 'Seg a sex, 08h às 17h',
    isOpen: Boolean(place.opening_hours?.open_now),
    rating: place.rating,
    source: 'google-places',
  };
}

export async function fetchNearbyBloodCenters(userLocation) {
  const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;
  if (!key) {
    return getFallbackHemocenters(userLocation);
  }

  const params = new URLSearchParams({
    key,
    location: `${userLocation.latitude},${userLocation.longitude}`,
    radius: String(PLACES_RADIUS_METERS),
    type: 'hospital',
    keyword: 'hemocentro banco de sangue doação sangue',
    language: 'pt-BR',
  });

  try {
    const response = await fetch(`${GOOGLE_PLACES_URL}?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.results) || data.results.length === 0) {
      return getFallbackHemocenters(userLocation);
    }

    return data.results
      .filter((place) => place.geometry?.location?.lat && place.geometry?.location?.lng)
      .map((place) => normalizePlace(place, userLocation))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 12);
  } catch (error) {
    return getFallbackHemocenters(userLocation);
  }
}
