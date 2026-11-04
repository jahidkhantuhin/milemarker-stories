import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TravelContext } from '../../shared/context/travel-context';
import { AuthContext } from '../../shared/context/auth-context';
import ImageCarousel from '../../shared/components/UIElements/ImageCarousel';
import { useHttpClient } from '../../shared/hooks/http-hook';

const TravelCard = ({ place, compact = false, onDelete }) => {
  const { savedIds, tripIds, toggleSaved, toggleTrip } = useContext(TravelContext);
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [shareLabel, setShareLabel] = useState('Share note');
  const [deleteError, setDeleteError] = useState('');
  const saved = savedIds.includes(place.id);
  const planned = tripIds.includes(place.id);
  const ownerId = place.creatorId || (typeof place.creator === 'string' ? place.creator : place.creator && (place.creator.id || place.creator._id));
  const isOwner = !!auth.isLoggedIn && !!place.isUserPlace && String(auth.userId) === String(ownerId);
  const share = async () => {
    const url = `${window.location.origin}/#place-${place.id}`;
    try {
      if (navigator.share) await navigator.share({ title: place.title, text: `${place.title} · ${place.address}`, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); setShareLabel('Link copied'); setTimeout(() => setShareLabel('Share note'), 1800); }
    } catch (error) { /* Sharing was dismissed. */ }
  };
  const deletePlace = async () => {
    if (!isOwner || !window.confirm('Delete this place from the field guide?')) return;
    try {
      await sendRequest(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/places/${place.id}`, 'DELETE', null, { Authorization: `Bearer ${auth.token}` });
      if (onDelete) onDelete(place.id);
    } catch (error) { setDeleteError(error.message); }
  };
  return (
    <article id={`place-${place.id}`} className={`travel-card${compact ? ' travel-card--compact' : ''}`}>
      <ImageCarousel className="travel-card__photo" images={place.images} image={place.image} title={place.title} />
      <div className="travel-card__photo-overlays">
        <span className="travel-card__category">{place.category}</span>
        <button className={`save-toggle${saved ? ' is-saved' : ''}`} type="button" onClick={() => toggleSaved(place.id)} aria-label={saved ? `Remove ${place.title} from saved places` : `Save ${place.title}`} aria-pressed={saved}>{saved ? '♥' : '♡'}</button>
      </div>
      <div className="travel-card__body">
        <div className="travel-card__heading"><div><span className="travel-card__address">{place.address}</span><h3>{place.title}</h3>{place.vibe && <span className="travel-card__mood">{place.vibe}</span>}</div>{place.rating ? <span className="travel-card__rating">★ {place.rating}</span> : <span className="travel-card__rating travel-card__community">COMMUNITY</span>}</div>
        <p className="travel-card__description">{place.description}</p>
        {!compact && place.tip && <div className="travel-card__tip"><span>FIELD NOTE</span><p>{place.tip}</p></div>}
        <div className="travel-card__meta"><span>◷ {place.days || 1} days</span><span>☀ Best {place.bestTime || 'Anytime'}</span><span>{place.budget ? `≈ $${place.budget}/day` : 'Budget varies'}</span></div>
        <div className="travel-card__tags">{(place.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="travel-card__actions">
          <button type="button" className={planned ? 'is-active' : ''} onClick={() => toggleTrip(place.id)}>{planned ? '✓ In trip board' : '+ Add to trip'}</button>
          <button type="button" className="travel-card__share" onClick={share}>{shareLabel}</button>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`} target="_blank" rel="noreferrer" aria-label={`Open ${place.address} in Maps`}>↗ Map</a>
        </div>
        {isOwner && <div className="travel-card__owner-actions"><span>YOUR FIELD NOTE</span><Link to={`/places/${place.id}`}>Edit</Link><button type="button" onClick={deletePlace}>Delete</button></div>}
        {deleteError && <p className="travel-card__delete-error" role="alert">{deleteError}</p>}
      </div>
    </article>
  );
};

export default TravelCard;
