import { Routine, Settings } from '../types';

export const mockRoutines: Routine[] = [
  {
    id: '1',
    title: 'Magnetic',
    artist: 'ILLIT',
    coverUrl: 'https://images.genius.com/7bef942ab2a22f0c24a5b0577703ac07.1000x1000x1.png',
    bpm: 114,
    difficulty: 'Intermediate',
    duration: 199,
    tags: ['upbeat', 'fun', 'retro'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 16, beats: 16 },
      { id: 's2', name: 'Verse 1', startBeat: 16, endBeat: 32, beats: 16 },
      { id: 's3', name: 'Chorus', startBeat: 32, endBeat: 48, beats: 16 },
    ],
  },
  {
    id: '2',
    title: 'Kill This Love',
    artist: 'BLACKPINK',
    coverUrl: 'https://images.unsplash.com/photo-1758670331604-16eeb6adb98d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHN0dWRpbyUyMHByYWN0aWNlfGVufDF8fHx8MTc2MDczMDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    bpm: 132,
    difficulty: 'Advanced',
    duration: 191,
    tags: ['powerful', 'fierce', 'energetic'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 8, beats: 8 },
      { id: 's2', name: 'Verse 1', startBeat: 8, endBeat: 24, beats: 16 },
      { id: 's3', name: 'Pre-Chorus', startBeat: 24, endBeat: 32, beats: 8 },
    ],
  },
  {
    id: '3',
    title: 'GO!',
    artist: 'cortis',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2734b56a34b0c2b3798fd46f855',
    bpm: 110,
    difficulty: 'Beginner',
    duration: 164,
    tags: ['smooth', 'groovy', 'chill'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 8, beats: 8 },
      { id: 's2', name: 'Verse 1', startBeat: 8, endBeat: 24, beats: 16 },
    ],
  },
  {
    id: '4',
    title: 'How You Like That',
    artist: 'BLACKPINK',
    coverUrl: 'https://images.unsplash.com/photo-1708533294868-84861bd174e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcG9wJTIwZGFuY2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjA4MTY3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bpm: 125,
    difficulty: 'Intermediate',
    duration: 182,
    tags: ['fierce', 'powerful', 'attitude'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 16, beats: 16 },
      { id: 's2', name: 'Chorus', startBeat: 16, endBeat: 32, beats: 16 },
    ],
  },
  {
    id: '5',
    title: 'Fancy',
    artist: 'TWICE',
    coverUrl: 'https://images.unsplash.com/photo-1758670331604-16eeb6adb98d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHN0dWRpbyUyMHByYWN0aWNlfGVufDF8fHx8MTc2MDczMDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    bpm: 128,
    difficulty: 'Beginner',
    duration: 215,
    tags: ['catchy', 'upbeat', 'fun'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 8, beats: 8 },
      { id: 's2', name: 'Verse 1', startBeat: 8, endBeat: 24, beats: 16 },
    ],
  },
  {
    id: '6',
    title: 'God\'s Menu',
    artist: 'Stray Kids',
    coverUrl: 'https://images.unsplash.com/photo-1651178836409-4460d0e47bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwY29uY2VydHxlbnwxfHx8fDE3NjA3MzQxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bpm: 140,
    difficulty: 'Advanced',
    duration: 170,
    tags: ['intense', 'complex', 'powerful'],
    segments: [
      { id: 's1', name: 'Intro', startBeat: 0, endBeat: 8, beats: 8 },
      { id: 's2', name: 'Verse 1', startBeat: 8, endBeat: 24, beats: 16 },
    ],
  },
];

export const defaultSettings: Settings = {
  videoResolution: '720p',
  ghostOpacity: 60,
  colorBlindMode: false,
  feedbackVerbosity: 'Advanced',
  mirrorCamera: true,
};

export const recentPracticeIds = ['1', '3'];
