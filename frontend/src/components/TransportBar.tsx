import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, RotateCcw, Repeat, Gauge, FlipHorizontal2, Camera, Zap, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface TransportBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onRecalibrate: () => void;
  fps?: number;
  warnings?: string[];
}

export function TransportBar({
  isPlaying,
  onPlayPause,
  onRestart,
  onRecalibrate,
  fps = 60,
  warnings = [],
}: TransportBarProps) {
  const [loopCount, setLoopCount] = useState<8 | 16>(8);
  const [speed, setSpeed] = useState<number>(1);

  return (
    <div className="bg-card border-t border-border p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            onClick={onPlayPause}
            className="bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90 text-white"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button variant="outline" size="lg" onClick={onRestart} className="border-border">
            <RotateCcw className="w-5 h-5" />
          </Button>

          <div className="h-8 w-[1px] bg-border mx-2" />

          {/* Loop */}
          <div className="flex gap-1 p-1 bg-background rounded-lg border border-border">
            <Button
              variant={loopCount === 8 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLoopCount(8)}
              className={loopCount === 8 ? 'bg-muted' : ''}
            >
              <Repeat className="w-3 h-3 mr-1" />8
            </Button>
            <Button
              variant={loopCount === 16 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLoopCount(16)}
              className={loopCount === 16 ? 'bg-muted' : ''}
            >
              <Repeat className="w-3 h-3 mr-1" />16
            </Button>
          </div>

          {/* Speed */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(speed === 1 ? 0.75 : 1)}
            className="border-border"
          >
            <Gauge className="w-3 h-3 mr-1" />
            {speed}×
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRecalibrate} className="border-border">
            <Camera className="w-4 h-4 mr-2" />
            Recalibrate
          </Button>

          <div className="h-8 w-[1px] bg-border mx-2" />

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              <Zap className="w-3 h-3 mr-1" />
              {fps} FPS
            </Badge>

            {warnings.map((warning, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {warning}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
