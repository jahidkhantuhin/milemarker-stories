import React, { useState } from 'react';
import './ImageCarousel.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const imageUrl = (image) => !image ? '' : (/^(https?:|data:|blob:)/i.test(image) ? image : `${apiUrl}/${image.replace(/^\//, '')}`);

const ImageCarousel = ({ images = [], image, title, className = '' }) => {
  const slides = (images.length ? images : (image ? [image] : [])).map(imageUrl);
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const move = (direction) => setActive((index) => (index + direction + slides.length) % slides.length);
  return <div className={`image-carousel ${className}`} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => {
    if (touchStart === null || slides.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    setTouchStart(null);
  }}>
    {slides.length > 0 && <img src={slides[active]} alt={title || 'Destination'} loading="lazy" />}
    {slides.length > 1 && <>
      <button className="image-carousel__arrow image-carousel__arrow--previous" type="button" onClick={() => move(-1)} aria-label={`Previous photo of ${title}`}>‹</button>
      <button className="image-carousel__arrow image-carousel__arrow--next" type="button" onClick={() => move(1)} aria-label={`Next photo of ${title}`}>›</button>
      <span className="image-carousel__counter" aria-live="polite">{active + 1} / {slides.length}</span>
      <div className="image-carousel__dots" role="group" aria-label={`${title} photos`}>{slides.map((_, index) => <button key={index} type="button" className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={index === active} />)}</div>
    </>}
    {!slides.length && <div className="image-carousel__placeholder">Photo coming soon</div>}
  </div>;
};

export default ImageCarousel;
