import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({
  isVisible = true,
  message = "Spraying Elegance...",
  showProgress = true,
  estimatedTime = 3000,
  onComplete,
  variant = 'default'
}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    startTimeRef.current = Date.now();

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    intervalRef.current = { progressInterval };

    return () => {
      clearInterval(progressInterval);
    };
  }, [isVisible, estimatedTime, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen loading-screen--${variant}`}>
      {/* Background Chimes Music */}
      <audio autoPlay loop preload="auto" style={{ display: 'none' }}>
        <source src="/sounds/chimes.mp3" type="audio/mpeg" />
        <source src="/sounds/chimes.ogg" type="audio/ogg" />
      </audio>
      <div className="loading-screen__overlay" />

      <div className="loading-screen__content">
        {/* Animated Logo/Brand */}
        <div className="loading-screen__brand">
          <div className="loading-screen__logo">
            <span className="loading-screen__logo-text">ALH.</span>
            <div className="loading-screen__logo-accent" />
          </div>
        </div>

        {/* Main Loading Animation - 3D Rotating Perfume Bottle */}
        <div className="loading-screen__animation">
          <div className="loading-screen__bottle-3d">
            <div className="loading-screen__bottle-body">
              <div className="loading-screen__bottle-cap" />
              <div className="loading-screen__bottle-neck" />
              <div className="loading-screen__bottle-base" />
              <div className="loading-screen__bottle-liquid" />
            </div>
            {/* Sparkling Mist Particles */}
            <div className="loading-screen__mist-particles">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="loading-screen__mist-particle"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    '--angle': `${i * 30}deg`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="loading-screen__message">
          <p className="loading-screen__text">{message}</p>
        </div>

        {/* Progress Indicator at Bottom */}
        {showProgress && (
          <div className="loading-screen__progress">
            <div className="loading-screen__progress-bar">
              <div
                className="loading-screen__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="loading-screen__progress-text">
              {Math.round(progress)}%
            </div>
          </div>
        )}

        {/* Perfume Bottles Animation */}
        <div className="loading-screen__bottles">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`loading-screen__bottle loading-screen__bottle--${i + 1}`}
              style={{
                animationDelay: `${i * 0.8}s`,
              }}
            >
              <div className="loading-screen__bottle-glow" />
            </div>
          ))}
        </div>

        {/* Micro-interactions */}
        <div className="loading-screen__particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="loading-screen__particle"
              style={{
                animationDelay: `${i * 0.3}s`,
                left: `${20 + i * 12}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Loading progress: {Math.round(progress)}%. {message}
      </div>
    </div>
  );
};

export default LoadingScreen;