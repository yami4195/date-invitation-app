import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { playCelebrationSound, playSparkleSound } from './AudioEffects';

const DATE_ACTIVITIES = [
  { id: 'dinner', label: '🍝 Romantic Dinner', emoji: '🍝' },
  { id: 'movie', label: '🎬 Movie & Snacks', emoji: '🎬' },
  { id: 'cafe', label: '☕ Cozy Cafe Date', emoji: '☕' },
  { id: 'stargazing', label: '🌌 Stargazing', emoji: '🌌' },
  { id: 'arcade', label: '🎮 Arcade & Boba', emoji: '🎮' },
  { id: 'surprise', label: '✨ Surprise Me!', emoji: '✨' },
];

export default function SuccessCelebration({ onReset, soundEnabled, dodgeCount }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cheerCount, setCheerCount] = useState(0);

  // Trigger rich multi-stage confetti barrage
  const triggerConfettiCannons = () => {
    // Center big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#c9184a', '#ffccd5', '#ffb703', '#8338ec']
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#ffffff']
      });
    }, 250);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#ff0054', '#c9184a', '#ffb703', '#8338ec']
      });
    }, 450);
  };

  useEffect(() => {
    playCelebrationSound(soundEnabled);
    triggerConfettiCannons();

    // Secondary celebration wave after 1s
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['circle', 'square']
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const handleLetsGoClick = () => {
    playSparkleSound(soundEnabled);
    setCheerCount(prev => prev + 1);

    // Extra festive burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#ff4d6d', '#ff0054', '#ffccd5', '#ffb703']
    });
  };

  const handleSelectActivity = (id) => {
    setSelectedActivity(id);
    playSparkleSound(soundEnabled);
  };

  return (
    <div className="celebration-card">
      <div className="celebration-visual" role="img" aria-label="Celebration Party">
        🥳
      </div>

      <h1 className="celebration-title">YAAAY! ❤️🥹</h1>
      <p className="celebration-subtitle">I knew you'd say yes!</p>
      <p className="celebration-note">
        {dodgeCount > 0
          ? `(Even after ${dodgeCount} attempt${dodgeCount === 1 ? '' : 's'} to hit NO 😉)`
          : `(First try! You didn't even hesitate 🥰)`}
      </p>

      {/* Fun Date Activity Selector */}
      <div className="date-ideas-box">
        <p className="date-ideas-label">Pick what we should do first:</p>
        <div className="date-tags">
          {DATE_ACTIVITIES.map((act) => (
            <button
              key={act.id}
              type="button"
              className={`date-tag ${selectedActivity === act.id ? 'selected' : ''}`}
              onClick={() => handleSelectActivity(act.id)}
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Let's Go Button */}
      <div>
        <button
          type="button"
          className="btn-celebration"
          onClick={handleLetsGoClick}
          aria-label="Let's go"
        >
          <span>Let's go! 💕 {cheerCount > 0 ? `(${cheerCount})` : ''}</span>
        </button>
      </div>

      <div>
        <button
          type="button"
          className="btn-reset"
          onClick={onReset}
          aria-label="Ask again from start"
        >
          ↺ Ask again (Play again)
        </button>
      </div>
    </div>
  );
}
