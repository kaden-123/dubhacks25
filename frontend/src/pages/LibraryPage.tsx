import { useState } from 'react';
import { mockRoutines, recentPracticeIds } from '../data/mockData';
import { RoutineCard } from '../components/RoutineCard';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Play } from 'lucide-react';
import { Button } from '../components/ui/button';

interface LibraryPageProps {
  onSelectRoutine: (routineId: string) => void;
  onContinue?: () => void;
}

export function LibraryPage({ onSelectRoutine, onContinue }: LibraryPageProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedBpmRange, setSelectedBpmRange] = useState<string | null>(null);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const bpmRanges = [
    { label: '100-119', min: 100, max: 119 },
    { label: '120-139', min: 120, max: 139 },
    { label: '140+', min: 140, max: 999 },
  ];

  const recentRoutines = mockRoutines.filter((r) => recentPracticeIds.includes(r.id));

  const filteredRoutines = mockRoutines.filter((routine) => {
    const matchesSearch = routine.title.toLowerCase().includes(search.toLowerCase()) ||
      routine.artist.toLowerCase().includes(search.toLowerCase());
    
    const matchesDifficulty = !selectedDifficulty || routine.difficulty === selectedDifficulty;
    
    const matchesBpm = !selectedBpmRange || (() => {
      const range = bpmRanges.find(r => r.label === selectedBpmRange);
      return range ? routine.bpm >= range.min && routine.bpm <= range.max : true;
    })();

    return matchesSearch && matchesDifficulty && matchesBpm;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 p-8 md:p-12 border border-purple-500/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative space-y-4 text-center">
            <h1 className="text-5xl md:text-7xl bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-pink)] to-[var(--neon-cyan)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              K-Pop Dance Trainer
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Master your favorite choreography with AI-powered coaching
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-transparent rounded-full" />
              <span className="text-sm text-purple-400">✨ Real-time Feedback</span>
              <div className="h-1 w-12 bg-gradient-to-l from-pink-500 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search routines or artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">Filters:</span>
            
            {difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  selectedDifficulty === difficulty
                    ? 'bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90 border-0'
                    : 'border-border hover:border-[var(--neon-purple)]'
                }`}
                onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
              >
                {difficulty}
              </Badge>
            ))}

            <div className="h-4 w-[1px] bg-border self-center" />

            {bpmRanges.map((range) => (
              <Badge
                key={range.label}
                variant={selectedBpmRange === range.label ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  selectedBpmRange === range.label
                    ? 'bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/90 border-0'
                    : 'border-border hover:border-[var(--neon-cyan)]'
                }`}
                onClick={() => setSelectedBpmRange(selectedBpmRange === range.label ? null : range.label)}
              >
                {range.label} BPM
              </Badge>
            ))}

            {(selectedDifficulty || selectedBpmRange) && (
              <Badge
                variant="outline"
                className="cursor-pointer border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setSelectedDifficulty(null);
                  setSelectedBpmRange(null);
                }}
              >
                Clear all
              </Badge>
            )}
          </div>
        </div>

        {/* Recent Practice */}
        {recentRoutines.length > 0 && (
          <div className="space-y-4">
            <h2>Recent Practice</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recentRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onClick={() => onSelectRoutine(routine.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Routines Grid */}
        <div className="space-y-4">
          <h2>All Routines</h2>
          {filteredRoutines.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No routines found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
