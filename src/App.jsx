import React, { useState } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import InvitationCard from './components/InvitationCard';
import SuccessCelebration from './components/SuccessCelebration';

export default function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const handleReset = () => {
    setIsAccepted(false);
    setDodgeCount(0);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="app-container">
      {/* Ambient background glows */}
      <div className="bg-ambient-blob-1" aria-hidden="true" />
      <div className="bg-ambient-blob-2" aria-hidden="true" />

      {/* Floating particles (hearts and sparkles) */}
      <BackgroundParticles />

      {/* Sound toggle button */}
      <button
        type="button"
        className="sound-toggle-btn"
        onClick={toggleSound}
        aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
      >
        <span>{soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}</span>
      </button>

      {/* Dynamic Views: Question vs Success Celebration */}
      {!isAccepted ? (
        <InvitationCard
          onAccept={handleAccept}
          dodgeCount={dodgeCount}
          setDodgeCount={setDodgeCount}
          soundEnabled={soundEnabled}
        />
      ) : (
        <SuccessCelebration
          onReset={handleReset}
          soundEnabled={soundEnabled}
          dodgeCount={dodgeCount}
        />
      )}
    </div>
  );
}
