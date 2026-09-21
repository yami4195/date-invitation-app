import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { playCelebrationSound, playSparkleSound } from './AudioEffects';

// Helper to format date in a romantic readable way
function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const d = new Date(year, parseInt(month, 10) - 1, day);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Helper to format time (e.g. 19:30 -> 7:30 PM)
function formatReadableTime(timeStr) {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const m = minutes || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${m} ${ampm}`;
  } catch {
    return timeStr;
  }
}

export default function SuccessCelebration({
  datePlan,
  onReset,
  soundEnabled,
  dodgeCount,
}) {
  const [cheerCount, setCheerCount] = useState(0);

  // Trigger rich multi-stage confetti barrage
  const triggerConfettiCannons = () => {
    // Center big burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: [
        '#ff4d6d',
        '#ff758f',
        '#c9184a',
        '#ffccd5',
        '#ffb703',
        '#8338ec',
      ],
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#ffffff'],
      });
    }, 250);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: ['#ff0054', '#c9184a', '#ffb703', '#8338ec'],
      });
    }, 450);
  };

  useEffect(() => {
    playCelebrationSound(soundEnabled);
    triggerConfettiCannons();

    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['circle', 'square'],
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const handleCheerClick = () => {
    playSparkleSound(soundEnabled);
    setCheerCount((prev) => prev + 1);

    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.7 },
      colors: ['#ff4d6d', '#ff0054', '#ffccd5', '#ffb703'],
    });
  };

  return (
    <div className="celebration-card">
      <div className="celebration-visual" role="img" aria-label="Celebration Party">
        🥳
      </div>

      <h1 className="celebration-title">IT'S A DATE! ❤️🥹</h1>
      <p className="celebration-subtitle">I knew you'd say yes!</p>

      {/* Date Plan Summary Details */}
      {datePlan && (
        <div className="date-summary-box">
          <div className="date-summary-header">Our Romantic Plan:</div>
          <div className="date-summary-grid">
            <div className="summary-item">
              <span className="summary-icon">📅</span>
              <div className="summary-content">
                <span className="summary-label">Date</span>
                <span className="summary-value">
                  {formatReadableDate(datePlan.date)}
                </span>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🕐</span>
              <div className="summary-content">
                <span className="summary-label">Time</span>
                <span className="summary-value">
                  {formatReadableTime(datePlan.time)}
                </span>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">📍</span>
              <div className="summary-content">
                <span className="summary-label">Place</span>
                <span className="summary-value">{datePlan.place}</span>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🍕</span>
              <div className="summary-content">
                <span className="summary-label">Food</span>
                <span className="summary-value">{datePlan.food}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="celebration-romantic-message">
        "I can't wait to see you ❤️"
      </p>

      {dodgeCount > 0 && (
        <p className="celebration-dodge-note">
          (Even after {dodgeCount} attempt{dodgeCount === 1 ? '' : 's'} to hit NO 😏)
        </p>
      )}

      {/* Main Cheer Button */}
      <div>
        <button
          type="button"
          className="btn-celebration"
          onClick={handleCheerClick}
          aria-label="Celebrate and cheer"
        >
          <span>Can't wait! 💕 {cheerCount > 0 ? `(${cheerCount})` : ''}</span>
        </button>
      </div>

      <div>
        <button
          type="button"
          className="btn-reset"
          onClick={onReset}
          aria-label="Plan another date or start over"
        >
          ↺ Plan another date
        </button>
      </div>
    </div>
  );
}
