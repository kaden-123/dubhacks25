import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, RotateCcw, Repeat, Gauge, Camera, FlipHorizontal2, Settings, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Slider } from './ui/slider';

interface PracticeControlBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onRecalibrate: () => void;
  onSettings: () => void;
  fps?: number;
  warnings?: string[];
  ghostOpacity: number;
  onGhostOpacityChange: (value: number) => void;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
}

export function PracticeControlBar({
  isPlaying,
  onPlayPause,
  onRestart,
  onRecalibrate,
  onSettings,
  fps = 60,
  warnings = [],
  ghostOpacity,
  onGhostOpacityChange,
  playbackRate = 1,
  onPlaybackRateChange,
}: PracticeControlBarProps) {
  const [loopCount, setLoopCount] = useState<8 | 16>(8);
  const [showGhostSlider, setShowGhostSlider] = useState(false);

  return (
    <div className="bg-gradient-to-r from-[#0f1219] via-[#13161f] to-[#0f1219] border-t border-white/10 px-6 py-4">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-6">
        {/* Left: Main Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all shadow-lg hover:shadow-purple-500/50"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>

          <button
            onClick={onRestart}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          {/* Loop */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setLoopCount(8)}
              className={`px-3 py-1.5 rounded text-xs transition-all flex items-center gap-1 ${
                loopCount === 8
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Repeat className="w-3 h-3" />8
            </button>
            <button
              onClick={() => setLoopCount(16)}
              className={`px-3 py-1.5 rounded text-xs transition-all flex items-center gap-1 ${
                loopCount === 16
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Repeat className="w-3 h-3" />16
            </button>
          </div>

          {/* Speed */}
          <button
            onClick={() => onPlaybackRateChange?.(playbackRate === 1 ? 0.75 : 1)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
          >
            <Gauge className="w-3 h-3" />
            {playbackRate}×
          </button>
        </div>

        {/* Center: Ghost & Mirror Controls */}
        <div className="flex items-center gap-3">
          {/* Ghost Opacity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGhostSlider(!showGhostSlider)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
            >
              {ghostOpacity > 0 ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Ghost {ghostOpacity}%
            </button>
            {showGhostSlider && (
              <div className="w-32">
                <Slider
                  value={[ghostOpacity]}
                  onValueChange={(values) => onGhostOpacityChange(values[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>


          {/* Recalibrate */}
          <button
            onClick={onRecalibrate}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
          >
            <Camera className="w-3 h-3" />
            Recalibrate
          </button>

          {/* Settings */}
          <button
            onClick={onSettings}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-green-500/30 text-green-400 bg-green-500/10 text-xs"
          >
            {fps} FPS
          </Badge>

          {warnings.length === 0 ? (
            <Badge
              variant="outline"
              className="border-green-500/30 text-green-400 bg-green-500/10 text-xs"
            >
              Connection OK
            </Badge>
          ) : (
            warnings.map((warning, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10 text-xs"
              >
                {warning}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
