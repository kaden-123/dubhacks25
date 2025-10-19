import { JointAccuracy, PracticeTip } from '../types';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface CoachPanelProps {
  overallAccuracy: number;
  jointAccuracies: JointAccuracy[];
  currentTip?: PracticeTip;
}

export function CoachPanel({ overallAccuracy, jointAccuracies, currentTip }: CoachPanelProps) {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-[var(--accuracy-good)]';
    if (accuracy >= 60) return 'text-[var(--accuracy-warning)]';
    return 'text-[var(--accuracy-poor)]';
  };

  const getAccuracyRingColor = (accuracy: number) => {
    if (accuracy >= 80) return '#10b981';
    if (accuracy >= 60) return '#eab308';
    return '#ef4444';
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-[var(--accuracy-good)]';
    if (accuracy >= 60) return 'bg-[var(--accuracy-warning)]';
    return 'bg-[var(--accuracy-poor)]';
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAccuracy / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Accuracy Ring */}
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={getAccuracyRingColor(overallAccuracy)}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{
                  filter: `drop-shadow(0 0 8px ${getAccuracyRingColor(overallAccuracy)})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl ${getAccuracyColor(overallAccuracy)}`}>
                {Math.round(overallAccuracy)}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Joint Heat Bars */}
      <Card className="p-4 bg-card border-border">
        <h4 className="mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Joint Tracking
        </h4>
        <div className="space-y-3">
          {jointAccuracies.map((joint) => (
            <div key={joint.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{joint.name}</span>
                <span className={getAccuracyColor(joint.accuracy)}>{Math.round(joint.accuracy)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(joint.accuracy)} transition-all duration-500`}
                  style={{ width: `${joint.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Tip Card */}
      {currentTip && (
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-purple-300 mb-1">{currentTip.joint}</div>
              <div className="text-sm">{currentTip.message}</div>
              {currentTip.beatIndex !== undefined && (
                <div className="text-xs text-muted-foreground mt-1">at beat {currentTip.beatIndex}</div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
