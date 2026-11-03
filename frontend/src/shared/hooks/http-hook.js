import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'atlas-demo-data';
const demoPlaces = [
  { id: 'place-1', title: 'Sunrise over the old town', description: 'A slow morning above the rooftops, followed by the best cardamom coffee in the city.', address: 'Lisbon, Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=85', creator: 'demo-user', location: { lat: 38.7223, lng: -9.1393 } },
  { id: 'place-2', title: 'The quiet side of Kyoto', description: 'Lantern-lit lanes, tiny neighbourhood shrines, and a dinner worth travelling for.', address: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85', creator: 'demo-user', location: { lat: 35.0116, lng: 135.7681 } },
  { id: 'place-3', title: 'A little blue in Chefchaouen', description: 'Getting wonderfully lost in the blue medina before the afternoon light disappears.', address: 'Chefchaouen, Morocco', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=85', creator: 'demo-user', location: { lat: 35.1688, lng: -5.2636 } },
  { id: 'place-4', title: 'Alpine air, no agenda', description: 'A favourite trail above the lake. Bring a picnic, leave your plans behind.', address: 'Lago di Braies, Italy', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', creator: 'demo-user', location: { lat: 46.6944, lng: 12.0856 } }
];
const initialData = { users: [
  { id: 'demo-user', name: 'Jahid Khan', email: 'hello@atlas.local', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' }
], places: demoPlaces };

function readData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialData; } catch (error) { return initialData; }
}
function writeData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function demoRequest(url, method, body) {
  const path = new URL(url, window.location.origin).pathname;
  const data = readData();
  if (method === 'GET' && path.endsWith('/api/users')) return { users: data.users.map(user => ({ ...user, places: data.places.filter(place => place.creator === user.id) })) };
  const placesPath = path.match(/\/api\/places(?:\/user\/([^/]+)|\/([^/]+))?$/);
  if (method === 'GET' && placesPath && placesPath[1]) return { places: data.places.filter(place => place.creator === placesPath[1]) };
  if (method === 'GET' && placesPath && placesPath[2]) { const place = data.places.find(item => item.id === placesPath[2]); if (!place) throw new Error('That story could not be found.'); return { place }; }
  const parse = () => body instanceof FormData ? Object.fromEntries(body.entries()) : (typeof body === 'string' ? JSON.parse(body) : body || {});
  if (method === 'POST' && /\/api\/users\/(login|signup)$/.test(path)) {
    const input = parse(); const user = data.users.find(item => item.email === input.email) || data.users[0];
    return { userId: user.id, token: 'atlas-demo-session', email: user.email };
  }
  if (method === 'POST' && path.endsWith('/api/places')) {
    const input = parse(); const place = { ...input, id: `place-${Date.now()}`, creator: 'demo-user', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85' };
    data.places.unshift(place); writeData(data); return { place };
  }
  if (method === 'PATCH' && placesPath && placesPath[2]) {
    const place = data.places.find(item => item.id === placesPath[2]); if (!place) throw new Error('That story could not be found.');
    Object.assign(place, parse()); writeData(data); return { place };
  }
  if (method === 'DELETE' && placesPath && placesPath[2]) { data.places = data.places.filter(item => item.id !== placesPath[2]); writeData(data); return { message: 'Deleted place.' }; }
  throw new Error('This action is unavailable in the preview.');
}

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);
  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const controller = new AbortController(); activeHttpRequests.current.push(controller);
    try {
      let result;
      try {
        const response = await fetch(url, { method, body, headers, signal: controller.signal });
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || 'Request failed.');
        result = responseData;
      } catch (networkError) {
        if (networkError.name === 'AbortError') throw networkError;
        if (!/^https?:\/\/localhost:5000\//.test(url)) throw networkError;
        result = demoRequest(url, method, body);
      }
      return result;
    } catch (requestError) { setError(requestError.message); throw requestError; }
    finally { activeHttpRequests.current = activeHttpRequests.current.filter(item => item !== controller); setIsLoading(false); }
  }, []);
  const clearError = useCallback(() => setError(null), []);
  useEffect(() => () => activeHttpRequests.current.forEach(controller => controller.abort()), []);
  return { isLoading, error, sendRequest, clearError };
};
