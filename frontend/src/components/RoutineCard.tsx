import { Routine } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Music } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RoutineCardProps {
  routine: Routine;
  onClick: () => void;
}

export function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const difficultyColor = {
    Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden bg-card border-border hover:border-[var(--neon-purple)] transition-all cursor-pointer hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <ImageWithFallback
          src={routine.coverUrl}
          alt={routine.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Badge className={`absolute top-3 right-3 ${difficultyColor[routine.difficulty]} border`}>
          {routine.difficulty}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1">{routine.title}</h3>
        <p className="text-muted-foreground mb-3">{routine.artist}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Music className="w-4 h-4" />
            <span>{routine.bpm} BPM</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(routine.duration / 60)}:{(routine.duration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
