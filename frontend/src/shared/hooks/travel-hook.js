import { useCallback, useEffect, useState } from 'react';

const loadList = (key) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : []; }
  catch (error) { return []; }
};

export const useTravel = () => {
  const [savedIds, setSavedIds] = useState(() => loadList('atlas-saved-places'));
  const [tripIds, setTripIds] = useState(() => loadList('atlas-trip-board'));
  useEffect(() => localStorage.setItem('atlas-saved-places', JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem('atlas-trip-board', JSON.stringify(tripIds)), [tripIds]);
  const toggleSaved = useCallback((id) => setSavedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]), []);
  const toggleTrip = useCallback((id) => setTripIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]), []);
  const reorderTrip = useCallback((id, direction) => setTripIds((ids) => {
    const index = ids.indexOf(id); const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return ids;
    const reordered = [...ids]; [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]]; return reordered;
  }), []);
  const clearTrip = useCallback(() => setTripIds([]), []);
  return { savedIds, tripIds, toggleSaved, toggleTrip, reorderTrip, clearTrip };
};
