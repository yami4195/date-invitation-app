import React, { useState } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import InvitationCard from './components/InvitationCard';
import DatePlannerForm from './components/DatePlannerForm';
import SuccessCelebration from './components/SuccessCelebration';

export default function App() {
  // 'invitation' -> 'planning' -> 'confirmed'
  const [currentStep, setCurrentStep] = useState('invitation');
  const [dodgeCount, setDodgeCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [datePlan, setDatePlan] = useState(null);

  const handleAccept = () => {
    setCurrentStep('planning');
  };

  const handlePlanConfirmed = (plan) => {
    setDatePlan(plan);
    setCurrentStep('confirmed');
  };

  const handleReset = () => {
    setCurrentStep('invitation');
    setDodgeCount(0);
    setDatePlan(null);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
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
        aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      >
        <span>{soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}</span>
      </button>

      {/* Multi-Step Flow: Invitation -> Date Planning -> Celebration */}
      {currentStep === 'invitation' && (
        <InvitationCard
          onAccept={handleAccept}
          dodgeCount={dodgeCount}
          setDodgeCount={setDodgeCount}
          soundEnabled={soundEnabled}
        />
      )}

      {currentStep === 'planning' && (
        <DatePlannerForm
          onConfirm={handlePlanConfirmed}
          soundEnabled={soundEnabled}
        />
      )}

      {currentStep === 'confirmed' && (
        <SuccessCelebration
          datePlan={datePlan}
          onReset={handleReset}
          soundEnabled={soundEnabled}
          dodgeCount={dodgeCount}
        />
      )}
    </div>
  );
}
