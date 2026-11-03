import React, { useContext, useState } from 'react';
import { TravelContext } from '../../shared/context/travel-context';

const TravelCard = ({ place, compact = false }) => {
  const { savedIds, tripIds, toggleSaved, toggleTrip } = useContext(TravelContext);
  const [shareLabel, setShareLabel] = useState('Share note');
  const saved = savedIds.includes(place.id);
  const planned = tripIds.includes(place.id);
  const share = async () => {
    const url = `${window.location.origin}/#place-${place.id}`;
    try {
      if (navigator.share) await navigator.share({ title: place.title, text: `${place.title} · ${place.address}`, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); setShareLabel('Link copied'); setTimeout(() => setShareLabel('Share note'), 1800); }
    } catch (error) { /* Sharing was dismissed. */ }
  };
  return (
    <article id={`place-${place.id}`} className={`travel-card${compact ? ' travel-card--compact' : ''}`}>
      <div className="travel-card__photo" style={{ backgroundImage: `url("${place.image}")` }} role="img" aria-label={`${place.address} landscape`}>
        <span className="travel-card__category">{place.category}</span>
        <button className={`save-toggle${saved ? ' is-saved' : ''}`} type="button" onClick={() => toggleSaved(place.id)} aria-label={saved ? `Remove ${place.title} from saved places` : `Save ${place.title}`} aria-pressed={saved}>{saved ? '♥' : '♡'}</button>
        <span className="travel-card__vibe">{place.vibe}</span>
      </div>
      <div className="travel-card__body">
        <div className="travel-card__heading"><div><span className="travel-card__address">{place.address}</span><h3>{place.title}</h3></div><span className="travel-card__rating">★ {place.rating}</span></div>
        <p className="travel-card__description">{place.description}</p>
        {!compact && <div className="travel-card__tip"><span>FIELD NOTE</span><p>{place.tip}</p></div>}
        <div className="travel-card__meta"><span>◷ {place.days} days</span><span>☀ Best {place.bestTime}</span><span>≈ ${place.budget}/day</span></div>
        <div className="travel-card__tags">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="travel-card__actions">
          <button type="button" className={planned ? 'is-active' : ''} onClick={() => toggleTrip(place.id)}>{planned ? '✓ In trip board' : '+ Add to trip'}</button>
          <button type="button" className="travel-card__share" onClick={share}>{shareLabel}</button>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`} target="_blank" rel="noreferrer" aria-label={`Open ${place.address} in Maps`}>↗ Map</a>
        </div>
      </div>
    </article>
  );
};

export default TravelCard;
