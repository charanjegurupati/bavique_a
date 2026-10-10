import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Sparkles, AlertCircle } from 'lucide-react';

export default function IntroVideo({ onComplete, forceOpen = false }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted sound
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion && !forceOpen) {
      onComplete();
      return;
    }

    setHasStarted(true);

    const playWithAudio = async () => {
      if (!videoRef.current) return;

      try {
        // Attempt immediate playback with sound
        videoRef.current.muted = false;
        setIsMuted(false);
        await videoRef.current.play();
      } catch (audioErr) {
        console.warn('Browser autoplay policy prevented audio playback without prior gesture:', audioErr);
        // Fallback: start video muted to guarantee smooth start
        try {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            await videoRef.current.play();
          }
        } catch (silentErr) {
          console.warn('Muted autoplay error:', silentErr);
        }

        // Unmute on the very first touch/click anywhere on the screen
        const unmuteOnFirstClick = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
          }
          window.removeEventListener('click', unmuteOnFirstClick);
          window.removeEventListener('touchstart', unmuteOnFirstClick);
        };

        window.addEventListener('click', unmuteOnFirstClick, { once: true });
        window.addEventListener('touchstart', unmuteOnFirstClick, { once: true });
      }
    };

    playWithAudio();
  }, [prefersReducedMotion, forceOpen, onComplete]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('bavique_intro_seen', 'true');
    onComplete();
  };

  const handleVideoEnded = () => {
    sessionStorage.setItem('bavique_intro_seen', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden select-none animate-fadeIn">
      {/* Full-Page Background Video (Plays immediately without play button) */}
      {!videoError && (
        <video
          ref={videoRef}
          poster="/logo-optimized.webp"
          playsInline
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={() => {
            console.warn('Video stream error, activating graceful boutique fallback.');
            setVideoError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/brand-intro.mp4" type="video/mp4" />
        </video>
      )}

      {/* Cinematic subtle dark gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/60 pointer-events-none" />

      {/* Fallback Display if video cannot load */}
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-radial from-champagne-100 via-champagne-200 to-chocolate-900">
          <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-champagne-300 to-gold-400 shadow-2xl mb-4">
            <img src="/logo-optimized.webp" alt="BAVIQUE" className="w-full h-full object-cover rounded-2xl bg-white" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-champagne-100 font-bold mb-3">
            BAVIQUE
          </h2>
          <p className="font-serif italic text-gold-300 text-lg md:text-xl max-w-md mb-8">
            More than just a store… it's a vibe.
          </p>
          <button
            onClick={handleSkip}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-rosegold-500 text-white font-bold tracking-wide shadow-xl hover:scale-105 transition-all"
          >
            Enter Boutique Catalogue
          </button>
        </div>
      )}

      {/* Header Overlay: Logo & Brand Name */}
      <div
        className={`absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center gap-3.5 transition-all duration-1000 ${
          hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-champagne-300 to-gold-400 shadow-lg flex-shrink-0 backdrop-blur-md">
          <img
            src="/logo-nav.webp"
            alt="BAVIQUE"
            className="w-full h-full object-cover rounded-[14px] bg-white"
          />
        </div>
        <div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-champagne-100 drop-shadow-md block">
            BAVIQUE
          </span>
          <span className="font-serif italic text-gold-300 text-xs sm:text-sm tracking-wider drop-shadow-xs block">
            More than just a store… it's a vibe.
          </span>
        </div>
      </div>

      {/* Top-Right Action Controls */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-3">
        {/* Audio Mute/Unmute */}
        {!videoError && (
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-3 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-lg flex items-center justify-center"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold-300" />}
          </button>
        )}

        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 text-xs sm:text-sm font-semibold tracking-wide transition-all hover:scale-105 shadow-xl hover:border-gold-300"
        >
          <span>Skip Intro</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Bar: Boutique Subtitle & Skip Prompt */}
      <div className="absolute bottom-8 left-6 right-6 sm:left-12 sm:right-12 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-2 text-champagne-200/90 text-xs sm:text-sm font-medium tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Fancy • Beauty • Fashion Boutique</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="pointer-events-auto text-xs text-champagne-200/80 hover:text-white underline underline-offset-4 decoration-gold-400 transition-colors"
        >
          Enter Full Catalogue Now →
        </button>
      </div>

      {/* Slim Golden Timeline Indicator along the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-gold-400 via-rosegold-400 to-gold-300 transition-all duration-200 shadow-gold-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
