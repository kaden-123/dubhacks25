/**
 * Video Player Component
 * 
 * Integrates with existing UI components and provides video playback
 * with synchronization for pose comparison.
 */

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onPlayPause?: () => void;
  onRestart?: () => void;
  onSeek?: (time: number) => void;
  playbackRate?: number;
  mirror?: boolean;
  showSkeleton?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoSrc,
  isPlaying,
  currentTime,
  duration,
  onTimeUpdate,
  onLoadedMetadata,
  onPlayPause,
  onRestart,
  onSeek,
  playbackRate = 1,
  mirror = false,
  showSkeleton = false,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  // Sync external play/pause state with video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync playback rate
  useEffect(() => {
    if (videoRef.current && playbackRate !== undefined) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync external currentTime prop changes with video element
  useEffect(() => {
    if (videoRef.current && !isSeeking) {
      const video = videoRef.current;
      const timeDiff = Math.abs(video.currentTime - currentTime);
      
      // Only update if there's a significant difference to avoid conflicts
      if (timeDiff > 0.1) {
        console.log(`Syncing video time: ${video.currentTime} -> ${currentTime}`);
        video.currentTime = currentTime;
      }
    }
  }, [currentTime, isSeeking]);

  // Handle video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setIsLoaded(true);
      onLoadedMetadata(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleError = () => {
    setError('Failed to load video');
  };

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  // Internal seek handler - only updates video element
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      console.log(`Seeking to: ${time}`);
      setIsSeeking(true);
      videoRef.current.currentTime = time;
      
      // Reset seeking flag after a short delay
      setTimeout(() => {
        setIsSeeking(false);
      }, 100);
    }
  };

  // Handle restart
  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      onRestart();
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        className={`w-full h-full object-cover ${mirror ? 'scale-x-[-1]' : ''}`}
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onCanPlay={handleCanPlay}
      />

      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🦴</div>
            <div className="text-sm text-white/80">Skeleton Mode</div>
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-tidation-all from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          {/* Time Display */}
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            disabled={!onPlayPause}
            className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-all ${onPlayPause ? 'hover:bg-white/30 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart || handleRestart}
            disabled={!onRestart}
            className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all ${onRestart ? 'hover:bg-white/30 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div 
            className={`w-full bg-white/20 rounded-full h-1 ${onSeek ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            onClick={onSeek ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickPercentage = clickX / rect.width;
              const newTime = clickPercentage * duration;
              handleSeek(newTime);
            } : undefined}
          >
            <div
              className="bg-white rounded-full h-1 transition-all duration-100"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-red-400 text-2xl">⚠️</div>
            <div className="text-white text-sm">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto" />
            <div className="text-white text-sm">Loading video...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format time
function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
