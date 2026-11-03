import { createContext } from 'react';

export const TravelContext = createContext({
  savedIds: [],
  tripIds: [],
  toggleSaved: () => {},
  toggleTrip: () => {},
  reorderTrip: () => {},
  clearTrip: () => {}
});
