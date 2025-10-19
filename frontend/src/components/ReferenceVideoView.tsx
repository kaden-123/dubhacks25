import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FlipHorizontal2, Eye, Gauge } from 'lucide-react';

interface ReferenceVideoViewProps {
  routineTitle: string;
}

export function ReferenceVideoView({ routineTitle }: ReferenceVideoViewProps) {
  const [speed, setSpeed] = useState<number>(1);
  const [mirror, setMirror] = useState(false);
  const [skeletonOnly, setSkeletonOnly] = useState(false);

  const speeds = [0.75, 1.0];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0B0E16] to-[#121626] rounded-lg overflow-hidden border border-white/5 relative">
      {/* Video placeholder */}
      <div className={`flex-1 flex items-center justify-center relative ${mirror ? 'scale-x-[-1]' : ''}`}>
        <div className="text-center space-y-3">
          <div className="text-5xl">💃</div>
          <div className="text-sm text-gray-400">Reference Video</div>
          {skeletonOnly && (
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              Skeleton Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Label overlay */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 uppercase tracking-wider">
        Reference
      </div>

      {/* Controls at bottom */}
      <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/5">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Speed control */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  speed === s
                    ? 'bg-purple-500/80 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Mirror toggle */}
          <button
            onClick={() => setMirror(!mirror)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              mirror
                ? 'bg-blue-500/80 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FlipHorizontal2 className="w-3 h-3" />
            Mirror
          </button>

          {/* Skeleton toggle */}
          <button
            onClick={() => setSkeletonOnly(!skeletonOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              skeletonOnly
                ? 'bg-cyan-500/80 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Eye className="w-3 h-3" />
            Skeleton
          </button>
        </div>
      </div>
    </div>
  );
}
