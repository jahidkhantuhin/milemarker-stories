import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MIN } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const initialInputs = {
  title: { value: '', isValid: false }, description: { value: '', isValid: false }, address: { value: '', isValid: false },
  images: { value: [], isValid: false }, category: { value: 'Culture', isValid: true }, vibe: { value: '', isValid: true },
  bestTime: { value: '', isValid: true }, tip: { value: '', isValid: true }, budget: { value: '0', isValid: true }, days: { value: '1', isValid: true }, tags: { value: '', isValid: true }
};

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(initialInputs, false);
  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isValid) return;
    try {
      const formData = new FormData();
      ['title', 'description', 'address', 'category', 'vibe', 'bestTime', 'tip', 'budget', 'days', 'tags'].forEach((key) => formData.append(key, formState.inputs[key].value));
      formState.inputs.images.value.forEach((file) => formData.append('images', file));
      await sendRequest(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/places`, 'POST', formData, { Authorization: `Bearer ${auth.token}` });
      history.push('/');
    } catch (requestError) { /* The error modal displays the request failure. */ }
  };

  return <section className="new-place-page">
    <ErrorModal error={error} onClear={clearError} />
    <div className="new-place-intro"><span className="eyebrow">ADD A NOTE TO THE FIELD GUIDE</span><h1>Somewhere worth<br/><em>passing along.</em></h1><p>Share the details you wish you had known before you went. Your note will appear on Explore.</p></div>
    <form className="place-form place-form--editorial" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="place-form__section-title"><span>01</span><div><strong>The place</strong><small>Give your discovery a name and a pin.</small></div></div>
      <Input id="title" element="input" type="text" label="Story title" placeholder="A little blue in Chefchaouen" validators={[VALIDATOR_REQUIRE()]} errorText="Add a title for your story." onInput={inputHandler} />
      <Input id="address" element="input" type="text" label="Location" placeholder="City, country" validators={[VALIDATOR_REQUIRE()]} errorText="Add the destination or address." onInput={inputHandler} />
      <Input id="description" element="textarea" label="Your story" rows={4} placeholder="What made this place special?" validators={[VALIDATOR_MINLENGTH(20)]} errorText="Tell the story in at least 20 characters." onInput={inputHandler} />
      <div className="place-form__two-col">
        <div className="form-control"><label htmlFor="category">Travel style</label><select id="category" value={formState.inputs.category.value} onChange={(event) => inputHandler('category', event.target.value, true)}><option>Culture</option><option>City breaks</option><option>Outdoors</option><option>Nature</option><option>Food</option><option>Coast</option><option>Slow travel</option></select></div>
        <Input id="vibe" element="input" type="text" label="The feeling" placeholder="Lake & trail" initialValue="" initialValid onInput={inputHandler} />
      </div>
      <div className="place-form__section-title"><span>02</span><div><strong>Useful details</strong><small>Help the next traveller plan with confidence.</small></div></div>
      <div className="place-form__two-col"><Input id="bestTime" element="input" type="text" label="Best time to visit" placeholder="May–June" initialValue="" initialValid onInput={inputHandler} /><Input id="days" element="input" type="number" min="1" label="Suggested days" placeholder="3" initialValue="1" initialValid validators={[VALIDATOR_MIN(1)]} errorText="Enter at least one day." onInput={inputHandler} /></div>
      <div className="place-form__two-col"><Input id="budget" element="input" type="number" min="0" label="Indicative budget per day (USD)" placeholder="85" initialValue="0" initialValid validators={[VALIDATOR_MIN(0)]} errorText="Budget cannot be negative." onInput={inputHandler} /><Input id="tags" element="input" type="text" label="Tags (comma separated)" placeholder="Food, walking, views" initialValue="" initialValid onInput={inputHandler} /></div>
      <Input id="tip" element="textarea" label="One local tip" placeholder="The little detail you'd tell a friend" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Add a useful tip (at least 5 characters)." onInput={inputHandler} />
      <div className="place-form__section-title"><span>03</span><div><strong>Bring it to life</strong><small>Add a small photo story. JPG, PNG, or WebP, up to 6 MB each.</small></div></div>
      <ImageUpload id="images" label="Destination photos" multiple maxFiles={6} onInput={inputHandler} errorText="Add at least one photo to publish this note." />
      <div className="place-form__footer"><span>Your note will be attributed to your account.</span><Button type="submit" disabled={!formState.isValid}>PUBLISH TO EXPLORE <span aria-hidden="true">↗</span></Button></div>
    </form>
  </section>;
};

export default NewPlace;
