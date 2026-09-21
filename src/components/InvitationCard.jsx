import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playDodgeSound } from './AudioEffects';

const NO_PHRASES = [
  "No 😏",
  "Are you sure? 🥺",
  "Think again! 💭",
  "Nice try 😂",
  "Nope! 🏃💨",
  "Try again 😏",
  "You can't catch me! 💨",
  "Error 404: No not found 🤖",
  "Wait, really? 💔",
  "Give YES a try! ✨",
  "Almost had it! 😜",
  "Still a NO? 🙈"
];

// Helper to get true visible viewport dimensions (accounting for mobile browser toolbars)
function getVisibleViewport() {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const width = vv ? vv.width : (document.documentElement.clientWidth || window.innerWidth);
  const height = vv ? vv.height : (document.documentElement.clientHeight || window.innerHeight);
  return { width, height };
}

export default function InvitationCard({ onAccept, dodgeCount, setDodgeCount, soundEnabled }) {
  const [noPosition, setNoPosition] = useState(null); // { top, left } strictly within visible screen
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDodging, setIsDodging] = useState(false);
  const [tilt, setTilt] = useState(0);

  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const lastDodgeTimeRef = useRef(0);

  // Directional repulsion with strict visible screen clamping
  const repelFromPoint = useCallback((pointX, pointY, isTouch = false) => {
    const btn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Vector from cursor/finger to button center
    let dx = btnCenterX - pointX;
    let dy = btnCenterY - pointY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Proximity trigger threshold
    const triggerThreshold = isTouch ? 150 : 110;
    if (!isTouch && dist > triggerThreshold) return;

    const now = Date.now();
    if (now - lastDodgeTimeRef.current < 75) return;
    lastDodgeTimeRef.current = now;

    playDodgeSound(soundEnabled);

    // If pointer is right on center, pick a random angle
    if (dist < 4) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
    } else {
      dx /= dist;
      dy /= dist;
    }

    // Viewport and Safe Bounds
    const viewport = getVisibleViewport();
    const padding = 28; // Generous safe margin from screen edge

    // Reserve max width for any phrase text changes so it NEVER expands off-screen
    const estimatedMaxBtnWidth = Math.max(btn.offsetWidth || 130, 230);
    const estimatedMaxBtnHeight = Math.max(btn.offsetHeight || 50, 60);

    const minX = padding;
    const maxX = Math.max(minX, viewport.width - estimatedMaxBtnWidth - padding);
    const minY = padding;
    const maxY = Math.max(minY, viewport.height - estimatedMaxBtnHeight - padding);

    // Push distance
    const pushDistance = isTouch ? 170 + Math.random() * 40 : 150 + Math.random() * 60;

    let targetX = rect.left + dx * pushDistance;
    let targetY = rect.top + dy * pushDistance;

    // Corner / Wall reflection: if reaching boundary, rebound towards the visible center area
    if (targetX > maxX - 15) {
      targetX = Math.max(minX, minX + (viewport.width * 0.2) + Math.random() * (viewport.width * 0.25));
    } else if (targetX < minX + 15) {
      targetX = Math.min(maxX, maxX - (viewport.width * 0.2) - Math.random() * (viewport.width * 0.25));
    }

    if (targetY > maxY - 15) {
      targetY = Math.max(minY, minY + (viewport.height * 0.2) + Math.random() * (viewport.height * 0.25));
    } else if (targetY < minY + 15) {
      targetY = Math.min(maxY, maxY - (viewport.height * 0.2) - Math.random() * (viewport.height * 0.25));
    }

    // Avoid overlapping the stationary YES button
    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      const safeZone = 35;
      const overlapsYes =
        targetX < yesRect.right + safeZone &&
        targetX + estimatedMaxBtnWidth > yesRect.left - safeZone &&
        targetY < yesRect.bottom + safeZone &&
        targetY + estimatedMaxBtnHeight > yesRect.top - safeZone;

      if (overlapsYes) {
        // Perpendicular evasion step
        const perpX = -dy;
        const perpY = dx;
        targetX = rect.left + perpX * (pushDistance + 40);
        targetY = rect.top + perpY * (pushDistance + 40);
      }
    }

    // Guaranteed STRICT visible screen clamping
    targetX = Math.min(Math.max(minX, targetX), maxX);
    targetY = Math.min(Math.max(minY, targetY), maxY);

    // Dynamic tilt in escape direction
    const calculatedTilt = Math.max(-14, Math.min(14, dx * 14));
    setTilt(calculatedTilt);

    setNoPosition({ left: targetX, top: targetY });
    setDodgeCount(prev => prev + 1);
    setPhraseIndex(prev => (prev + 1) % NO_PHRASES.length);
    setIsDodging(true);

    setTimeout(() => {
      setIsDodging(false);
      setTilt(0);
    }, 220);
  }, [soundEnabled, setDodgeCount]);

  // Desktop real-time mouse proximity tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      repelFromPoint(e.clientX, e.clientY, false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [repelFromPoint]);

  // Handle window resizing safely so button remains strictly within visible area
  useEffect(() => {
    const handleResize = () => {
      if (noPosition) {
        const viewport = getVisibleViewport();
        const padding = 28;
        const btn = noBtnRef.current;
        const btnW = btn ? Math.max(btn.offsetWidth, 230) : 230;
        const btnH = btn ? Math.max(btn.offsetHeight, 60) : 60;

        const maxX = Math.max(padding, viewport.width - btnW - padding);
        const maxY = Math.max(padding, viewport.height - btnH - padding);

        setNoPosition(prev => {
          if (!prev) return null;
          return {
            left: Math.min(Math.max(padding, prev.left), maxX),
            top: Math.min(Math.max(padding, prev.top), maxY)
          };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [noPosition]);

  // Scale bonus for YES button as NO dodges
  const yesScale = Math.min(1 + dodgeCount * 0.035, 1.35);

  return (
    <div className="romantic-card">
      <div className="card-visual-wrapper">
        <span className="pulsing-heart-icon" role="img" aria-label="Sparkling Heart">💖</span>
        <span className="sparkles-overlay" role="img" aria-label="Sparkles">✨</span>
      </div>

      <h1 className="card-title">Will you go on a date with me? ❤️</h1>
      <p className="card-subtitle">I promise it'll be worth it 🥹</p>

      {dodgeCount > 0 && (
        <div className="dodge-counter-badge">
          <span>🏃 Escaped {dodgeCount} time{dodgeCount === 1 ? '' : 's'}!</span>
        </div>
      )}

      <div className="actions-container">
        {/* Stationary YES Button */}
        <button
          ref={yesBtnRef}
          className="btn-primary-yes"
          onClick={onAccept}
          style={{ transform: `scale(${yesScale})` }}
          aria-label="Yes, I will go on a date with you"
        >
          <span>YES ❤️</span>
        </button>

        {/* Evasive & Floating NO Button */}
        <button
          ref={noBtnRef}
          className={`btn-secondary-no ${noPosition ? 'is-escaping' : 'is-floating'}`}
          style={
            noPosition
              ? {
                  left: `${noPosition.left}px`,
                  top: `${noPosition.top}px`,
                  transform: isDodging
                    ? `scale(0.92) rotate(${tilt}deg)`
                    : `scale(1) rotate(0deg)`
                }
              : {}
          }
          onMouseEnter={(e) => {
            repelFromPoint(e.clientX, e.clientY, false);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0] || e.changedTouches[0];
            if (touch) {
              repelFromPoint(touch.clientX, touch.clientY, true);
            }
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            repelFromPoint(e.clientX, e.clientY, true);
          }}
          onClick={(e) => {
            e.preventDefault();
            repelFromPoint(e.clientX, e.clientY, true);
          }}
          aria-label="No button (resists cursor and escapes within screen)"
        >
          <span>{NO_PHRASES[phraseIndex]}</span>
        </button>
      </div>
    </div>
  );
}
