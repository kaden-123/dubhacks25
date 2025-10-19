export interface Routine {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  bpm: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // seconds
  tags: string[];
  segments: Segment[];
}

export interface Segment {
  id: string;
  name: string;
  startBeat: number;
  endBeat: number;
  beats: number;
}

export interface JointAccuracy {
  name: string;
  accuracy: number; // 0-100
}

export interface PracticeTip {
  joint: string;
  message: string;
  beatIndex?: number;
}

export interface SkeletonPoint {
  x: number;
  y: number;
  confidence: number;
}

export interface Skeleton {
  points: Record<string, SkeletonPoint>;
}

export interface Settings {
  videoResolution: '720p' | '1080p' | '480p';
  ghostOpacity: number;
  colorBlindMode: boolean;
  feedbackVerbosity: 'Basic' | 'Advanced';
  mirrorCamera: boolean;
}
