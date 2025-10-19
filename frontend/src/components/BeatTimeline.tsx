import { Segment } from '../types';
import { useEffect, useState } from 'react';

interface BeatTimelineProps {
  segments: Segment[];
  currentBeat: number;
  totalBeats: number;
  errorRegions?: number[]; // beats with high error
}

export function BeatTimeline({ segments, currentBeat, totalBeats, errorRegions = [] }: BeatTimelineProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentBeat / totalBeats) * 100);
  }, [currentBeat, totalBeats]);

  return (
    <div className="relative h-20 bg-gradient-to-b from-[#1a1d2e] to-transparent border-b border-white/5">
      {/* Segments background */}
      <div className="absolute inset-0 flex">
        {segments.map((segment, idx) => {
          const width = (segment.beats / totalBeats) * 100;
          return (
            <div
              key={segment.id}
              className="relative border-r border-white/5"
              style={{ width: `${width}%` }}
            >
              <div className="absolute top-3 left-3 text-xs text-gray-400 uppercase tracking-wide">
                {segment.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Beat ticks */}
      <div className="absolute inset-0 flex items-end pb-3">
        {Array.from({ length: totalBeats }).map((_, beatIdx) => {
          const isStrongBeat = beatIdx % 4 === 0;
          const isErrorBeat = errorRegions.includes(beatIdx);
          return (
            <div
              key={beatIdx}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div
                className={`w-[1px] transition-all ${
                  isErrorBeat
                    ? 'bg-red-500 h-8 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    : isStrongBeat
                    ? 'bg-white/40 h-6'
                    : 'bg-white/15 h-3'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Playhead - glowing cyan indicator */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-cyan-400 transition-all duration-100"
        style={{ 
          left: `${progress}%`,
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)'
        }}
      >
        <div 
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full"
          style={{
            boxShadow: '0 0 12px rgba(34, 211, 238, 1), 0 0 24px rgba(34, 211, 238, 0.6)'
          }}
        />
      </div>

      {/* Beat counter */}
      <div className="absolute bottom-3 left-4 text-xs text-gray-500">
        Beat {currentBeat}
      </div>
      <div className="absolute bottom-3 right-4 text-xs text-gray-500">
        {totalBeats} beats total
      </div>
    </div>
  );
}
