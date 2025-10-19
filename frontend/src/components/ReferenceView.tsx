import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, Gauge } from 'lucide-react';

interface ReferenceViewProps {
  routineTitle: string;
}

export function ReferenceView({ routineTitle }: ReferenceViewProps) {
  const [speed, setSpeed] = useState<number>(1);
  const [mirror, setMirror] = useState(false);
  const [skeletonOnly, setSkeletonOnly] = useState(false);

  const speeds = [0.75, 1.0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-muted-foreground">Reference</h3>
        <Badge variant="outline" className="border-[var(--neon-purple)] text-[var(--neon-purple)]">
          {routineTitle}
        </Badge>
      </div>

      <Card className="relative aspect-video bg-black border-border overflow-hidden">
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 ${mirror ? 'scale-x-[-1]' : ''}`}>
          <div className="text-center space-y-2">
            <div className="text-4xl">💃</div>
            <div className="text-sm text-muted-foreground">Reference Video</div>
            {skeletonOnly && (
              <Badge variant="outline" className="text-xs">
                Skeleton Mode
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 p-1 bg-card rounded-lg border border-border">
          {speeds.map((s) => (
            <Button
              key={s}
              variant={speed === s ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSpeed(s)}
              className={speed === s ? 'bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90' : ''}
            >
              {s}×
            </Button>
          ))}
        </div>

        <Button
          variant={mirror ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMirror(!mirror)}
          className={mirror ? 'bg-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/90 border-0' : 'border-border'}
        >
          Mirror
        </Button>

        <Button
          variant={skeletonOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSkeletonOnly(!skeletonOnly)}
          className={skeletonOnly ? 'bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/90 border-0' : 'border-border'}
        >
          <Eye className="w-4 h-4 mr-1" />
          Skeleton
        </Button>
      </div>
    </div>
  );
}
