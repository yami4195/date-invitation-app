import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { playSparkleSound } from './AudioEffects';

const PLACE_SUGGESTIONS = [
  '🍕 Pizza Hut',
  '☕ Tomoca',
  '🌆 Friendship Park',
  '✨ Somewhere special',
];

const FOOD_SUGGESTIONS = [
  '🍕 Pizza',
  '🍔 Burger',
  '🍗 Chicken',
  '🍝 Pasta',
  '☕ Coffee',
  '🍰 Dessert',
  '❤️ Surprise me',
];

export default function DatePlannerForm({ onConfirm, soundEnabled }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [customPlace, setCustomPlace] = useState('');
  const [isCustomPlace, setIsCustomPlace] = useState(false);

  const [selectedFood, setSelectedFood] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [isCustomFood, setIsCustomFood] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get today's date in YYYY-MM-DD for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const finalPlace = isCustomPlace ? customPlace.trim() : selectedPlace;
  const finalFood = isCustomFood ? customFood.trim() : selectedFood;

  // Validation
  const isDateValid = date && date >= todayStr;
  const isTimeValid = Boolean(time);
  const isPlaceValid = Boolean(finalPlace);
  const isFoodValid = Boolean(finalFood);
  const isFormValid = isDateValid && isTimeValid && isPlaceValid && isFoodValid;

  const handlePlaceSelect = (place) => {
    playSparkleSound(soundEnabled);
    setIsCustomPlace(false);
    setSelectedPlace(place);
    setErrorMessage('');
  };

  const handleEnableCustomPlace = () => {
    playSparkleSound(soundEnabled);
    setIsCustomPlace(true);
    setSelectedPlace('');
    setErrorMessage('');
  };

  const handleFoodSelect = (food) => {
    playSparkleSound(soundEnabled);
    setIsCustomFood(false);
    setSelectedFood(food);
    setErrorMessage('');
  };

  const handleEnableCustomFood = () => {
    playSparkleSound(soundEnabled);
    setIsCustomFood(true);
    setSelectedFood('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    if (date < todayStr) {
      setErrorMessage('Please choose today or a future date for our date! 📅');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const planPayload = {
        date: date,
        time: time.length === 5 ? `${time}:00` : time,
        place: finalPlace,
        food: finalFood,
      };

      const { error } = await supabase
        .from('date_plans')
        .insert([planPayload]);

      if (error) {
        console.error('Supabase insert error details:', error);
        throw error;
      }

      // Success
      onConfirm(planPayload);
    } catch (err) {
      console.error('Failed to save date plan to Supabase:', err);
      if (err?.message?.includes('row-level security') || err?.code === '42501') {
        setErrorMessage('Database permission error (RLS policy missing). Please enable public insert policy on Supabase.');
      } else {
        setErrorMessage('Something went wrong 😭 Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="romantic-card planner-card">
      <div className="card-visual-wrapper">
        <span className="pulsing-heart-icon" role="img" aria-label="Planner">
          💌
        </span>
        <span className="sparkles-overlay" role="img" aria-label="Sparkles">
          ✨
        </span>
      </div>

      <h1 className="card-title">Let's Plan Our Date! 💖</h1>
      <p className="card-subtitle">Tell me what your ideal date looks like 🥰</p>

      {errorMessage && (
        <div className="form-error-banner" role="alert">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="planner-form">
        {/* Date Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="date-input">
            When should we go? 📅
          </label>
          <input
            id="date-input"
            type="date"
            min={todayStr}
            className="form-input"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrorMessage('');
            }}
            required
          />
        </div>

        {/* Time Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="time-input">
            What time? 🕐
          </label>
          <input
            id="time-input"
            type="time"
            className="form-input"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setErrorMessage('');
            }}
            required
          />
        </div>

        {/* Place Field */}
        <div className="form-group">
          <label className="form-label">Where should we go? 📍</label>
          <div className="choice-pills">
            {PLACE_SUGGESTIONS.map((place) => (
              <button
                key={place}
                type="button"
                className={`choice-pill ${
                  !isCustomPlace && selectedPlace === place ? 'active' : ''
                }`}
                onClick={() => handlePlaceSelect(place)}
              >
                {place}
              </button>
            ))}
            <button
              type="button"
              className={`choice-pill ${isCustomPlace ? 'active' : ''}`}
              onClick={handleEnableCustomPlace}
            >
              ✏️ Custom Place
            </button>
          </div>

          {isCustomPlace && (
            <input
              type="text"
              placeholder="Enter your dream location..."
              className="form-input custom-input"
              value={customPlace}
              onChange={(e) => {
                setCustomPlace(e.target.value);
                setErrorMessage('');
              }}
              autoFocus
              required
            />
          )}
        </div>

        {/* Food Field */}
        <div className="form-group">
          <label className="form-label">What would you like to eat? 🍕</label>
          <div className="choice-pills">
            {FOOD_SUGGESTIONS.map((food) => (
              <button
                key={food}
                type="button"
                className={`choice-pill ${
                  !isCustomFood && selectedFood === food ? 'active' : ''
                }`}
                onClick={() => handleFoodSelect(food)}
              >
                {food}
              </button>
            ))}
            <button
              type="button"
              className={`choice-pill ${isCustomFood ? 'active' : ''}`}
              onClick={handleEnableCustomFood}
            >
              ✏️ Custom Food
            </button>
          </div>

          {isCustomFood && (
            <input
              type="text"
              placeholder="Enter your favorite food or treat..."
              className="form-input custom-input"
              value={customFood}
              onChange={(e) => {
                setCustomFood(e.target.value);
                setErrorMessage('');
              }}
              autoFocus
              required
            />
          )}
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`btn-primary-yes btn-confirm ${
            !isFormValid || isLoading ? 'disabled' : ''
          }`}
          aria-label="Confirm our date"
        >
          {isLoading ? (
            <span className="loading-spinner-wrapper">
              <span className="spinner-dot" /> Planning our date... ❤️
            </span>
          ) : (
            <span>Confirm our date ❤️</span>
          )}
        </button>
      </form>
    </div>
  );
}
