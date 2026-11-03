import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TravelCard from '../components/TravelCard';
import { categories, travelNotes } from '../../shared/data/travel-content';

const Discover = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All places');
  const [sort, setSort] = useState('curated');
  const places = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = travelNotes.filter((place) => {
      const matchesCategory = category === 'All places' || place.category === category;
      const searchable = `${place.title} ${place.address} ${place.category} ${place.vibe} ${place.tags.join(' ')}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    if (sort === 'rating') return filtered.sort((a, b) => b.rating - a.rating);
    if (sort === 'budget') return filtered.sort((a, b) => a.budget - b.budget);
    return filtered;
  }, [query, category, sort]);

  return <div className="discover-page">
    <section className="discover-banner">
      <div><span className="eyebrow">THE ATLAS FIELD GUIDE · VOL. 01</span><h1>Find a place<br/><em>that stays with you.</em></h1><p>Eight thoughtful starting points, with the little details that make a trip feel like yours.</p><div className="discover-banner__links"><Link to="/trip-planner">Build a trip board <span>↗</span></Link><Link to="/community">Meet the travellers <span>↗</span></Link></div></div>
      <div className="discover-banner__stamp"><span>GO SLOW</span><b>✳</b><span>LOOK CLOSER</span></div>
    </section>
    <section className="discovery-section" aria-labelledby="discover-heading">
      <div className="section-heading"><div><span className="eyebrow">CURATED FOR THE CURIOUS</span><h2 id="discover-heading">A few good directions<span>.</span></h2></div><p>Field notes include a best season, a realistic daily budget, and one small local tip.</p></div>
      <div className="discover-controls"><label className="discover-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, moods, or tags" aria-label="Search travel notes" /></label><label className="discover-sort">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="curated">Curated order</option><option value="rating">Top rated</option><option value="budget">Lower daily budget</option></select></label></div>
      <div className="category-filters" role="group" aria-label="Filter by travel style">{categories.map((item) => <button key={item} type="button" className={category === item ? 'is-selected' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
      <p className="result-count">Showing <strong>{places.length}</strong> of {travelNotes.length} field notes</p>
      {places.length ? <div className="travel-grid">{places.map((place) => <TravelCard key={place.id} place={place} />)}</div> : <div className="empty-discovery"><h3>No notes found</h3><p>Try another destination, tag, or travel style.</p><button type="button" onClick={() => { setQuery(''); setCategory('All places'); }}>Clear filters</button></div>}
    </section>
  </div>;
};

export default Discover;
