import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TravelContext } from '../../shared/context/travel-context';
import { travelNotes } from '../../shared/data/travel-content';
import TravelCard from '../components/TravelCard';

const TripPlanner = () => {
  const { tripIds, reorderTrip, clearTrip } = useContext(TravelContext);
  const [message, setMessage] = useState('');
  const places = tripIds.map((id) => travelNotes.find((place) => place.id === id)).filter(Boolean);
  const nights = places.reduce((total, place) => total + place.days, 0);
  const estimatedSpend = places.reduce((total, place) => total + place.days * place.budget, 0);
  const exportPlan = () => {
    const text = ['ATLAS · MY TRIP BOARD', '', ...places.map((place, index) => `${index + 1}. ${place.address} — ${place.title}\n   ${place.days} days · Best ${place.bestTime} · approx. $${place.budget}/day\n   Field note: ${place.tip}`), '', `Estimated duration: ${nights} days`, `Indicative spend: $${estimatedSpend} per traveller (excluding travel to destination)`].join('\n');
    const blob = new Blob([text], { type: 'text/plain' }); const href = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = href; anchor.download = 'atlas-trip-board.txt'; anchor.click(); URL.revokeObjectURL(href); setMessage('Trip board exported.'); setTimeout(() => setMessage(''), 2200);
  };
  return <section className="trip-page">
    <div className="trip-intro"><span className="eyebrow">A PLAN WITH ROOM TO WANDER</span><h1>Make a little<br/><em>room for wonder.</em></h1><p>Collect places, set the order, and export a simple field plan. Your board saves automatically in this browser.</p></div>
    {places.length > 0 && <div className="trip-summary"><div><span>STOPS</span><strong>{places.length}</strong></div><div><span>EST. DAYS</span><strong>{nights}</strong></div><div><span>INDICATIVE SPEND</span><strong>${estimatedSpend.toLocaleString()}</strong><small>per traveller · excludes transport</small></div><div className="trip-summary__actions"><button type="button" onClick={exportPlan}>↓ Export plan</button><button type="button" className="text-button" onClick={clearTrip}>Clear board</button>{message && <span role="status">{message}</span>}</div></div>}
    {!places.length ? <div className="collection-empty"><span>✳</span><h2>Your next trip starts with one place.</h2><p>Add a field note and shape an itinerary at your own pace.</p><Link to="/">Explore destinations <b>↗</b></Link></div> : <div className="trip-stops">{places.map((place, index) => <div className="trip-stop" key={place.id}><div className="trip-stop__rail"><span>{String(index + 1).padStart(2, '0')}</span><div><button type="button" onClick={() => reorderTrip(place.id, -1)} disabled={index === 0} aria-label={`Move ${place.address} earlier`}>↑</button><button type="button" onClick={() => reorderTrip(place.id, 1)} disabled={index === places.length - 1} aria-label={`Move ${place.address} later`}>↓</button></div></div><TravelCard place={place} compact /></div>)}</div>}
  </section>;
};

export default TripPlanner;
