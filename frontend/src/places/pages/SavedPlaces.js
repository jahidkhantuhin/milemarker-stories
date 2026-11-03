import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import TravelCard from '../components/TravelCard';
import { TravelContext } from '../../shared/context/travel-context';
import { travelNotes } from '../../shared/data/travel-content';

const SavedPlaces = () => {
  const { savedIds } = useContext(TravelContext);
  const places = travelNotes.filter((place) => savedIds.includes(place.id));
  return <section className="collection-page">
    <div className="collection-intro"><span className="eyebrow">YOUR PRIVATE SHORTLIST</span><h1>Places to keep<br/><em>close at hand.</em></h1><p>Save the notes that spark something. They stay right here in this browser.</p><span className="collection-count">{places.length.toString().padStart(2, '0')} SAVED NOTES</span></div>
    {places.length ? <div className="travel-grid">{places.map((place) => <TravelCard key={place.id} place={place} compact />)}</div> : <div className="collection-empty"><span>♡</span><h2>Your shortlist is a blank page.</h2><p>Tap the heart on any field note and it will be waiting here.</p><Link to="/">Explore the field guide <b>↗</b></Link></div>}
  </section>;
};

export default SavedPlaces;
