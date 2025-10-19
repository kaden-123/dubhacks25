/**
 * Video-Beat Synchronization Hook
 * 
 * Manages synchronization between video playback and beat timing
 * for accurate pose comparison and feedback timing.
 */

import { useState, useEffect, useCallback } from 'react';

export interface BeatSyncState {
  currentBeat: number;
  totalBeats: number;
  beatProgress: number; // 0-1
  isOnBeat: boolean;
  timeToNextBeat: number; // milliseconds
  bpm: number;
}

export interface UseVideoBeatSyncOptions {
  bpm: number;
  totalBeats: number;
  videoCurrentTime: number;
  videoDuration: number;
  onBeatChange?: (beat: number) => void;
  onSegmentChange?: (segmentIndex: number) => void;
}

export function useVideoBeatSync({
  bpm,
  totalBeats,
  videoCurrentTime,
  videoDuration,
  onBeatChange,
  onSegmentChange,
}: UseVideoBeatSyncOptions) {
  const [state, setState] = useState<BeatSyncState>({
    currentBeat: 0,
    totalBeats,
    beatProgress: 0,
    isOnBeat: false,
    timeToNextBeat: 0,
    bpm,
  });

  // Calculate beat timing
  const calculateBeatFromTime = useCallback((time: number): number => {
    if (bpm <= 0 || videoDuration <= 0) return 0;
    
    // Calculate beats per second
    const beatsPerSecond = bpm / 60;
    
    // Calculate current beat based on time
    const beat = Math.floor(time * beatsPerSecond);
    
    return Math.min(beat, totalBeats - 1);
  }, [bpm, videoDuration, totalBeats]);

  // Calculate beat progress within current beat
  const calculateBeatProgress = useCallback((time: number): number => {
    if (bpm <= 0) return 0;
    
    const beatsPerSecond = bpm / 60;
    const currentBeatStart = Math.floor(time * beatsPerSecond) / beatsPerSecond;
    const beatDuration = 1 / beatsPerSecond;
    
    return (time - currentBeatStart) / beatDuration;
  }, [bpm]);

  // Update beat state
  const updateBeatState = useCallback((time: number) => {
    const currentBeat = calculateBeatFromTime(time);
    const beatProgress = calculateBeatProgress(time);
    const beatsPerSecond = bpm / 60;
    const timeToNextBeat = ((1 - beatProgress) / beatsPerSecond) * 1000; // Convert to milliseconds

    setState(prev => ({
      ...prev,
      currentBeat,
      beatProgress,
      timeToNextBeat,
      isOnBeat: beatProgress < 0.1 || beatProgress > 0.9, // Consider "on beat" within 10% of beat start/end
    }));

    // Trigger callbacks when beat changes
    if (currentBeat !== state.currentBeat) {
      onBeatChange?.(currentBeat);
    }
  }, [calculateBeatFromTime, calculateBeatProgress, bpm, onBeatChange, state.currentBeat]);

  // Update state when video time changes
  useEffect(() => {
    updateBeatState(videoCurrentTime);
  }, [videoCurrentTime, updateBeatState]);

  // Update BPM in state
  useEffect(() => {
    setState(prev => ({ ...prev, bpm }));
  }, [bpm]);

  // Update total beats in state
  useEffect(() => {
    setState(prev => ({ ...prev, totalBeats }));
  }, [totalBeats]);

  // Calculate which segment we're in (if segments are provided)
  const getCurrentSegment = useCallback((segments: Array<{ beats: number }>): number => {
    let beatCount = 0;
    for (let i = 0; i < segments.length; i++) {
      beatCount += segments[i].beats;
      if (state.currentBeat < beatCount) {
        return i;
      }
    }
    return segments.length - 1;
  }, [state.currentBeat]);

  // Get beat position within current segment
  const getBeatInSegment = useCallback((segments: Array<{ beats: number }>): number => {
    let beatCount = 0;
    for (let i = 0; i < segments.length; i++) {
      const segmentEnd = beatCount + segments[i].beats;
      if (state.currentBeat < segmentEnd) {
        return state.currentBeat - beatCount;
      }
      beatCount = segmentEnd;
    }
    return 0;
  }, [state.currentBeat]);

  // Get timing offset from ideal beat
  const getBeatOffset = useCallback((): number => {
    const idealBeatTime = state.currentBeat / (bpm / 60);
    return Math.abs(videoCurrentTime - idealBeatTime);
  }, [state.currentBeat, bpm, videoCurrentTime]);

  // Check if we're ahead or behind the beat
  const getBeatTiming = useCallback((): 'ahead' | 'behind' | 'on-time' => {
    const offset = getBeatOffset();
    const threshold = 0.1; // 100ms threshold
    
    if (offset < threshold) return 'on-time';
    return videoCurrentTime > (state.currentBeat / (bpm / 60)) ? 'ahead' : 'behind';
  }, [getBeatOffset, videoCurrentTime, state.currentBeat, bpm]);

  return {
    state,
    getCurrentSegment,
    getBeatInSegment,
    getBeatOffset,
    getBeatTiming,
  };
}
