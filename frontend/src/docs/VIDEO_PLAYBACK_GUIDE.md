# Video Playback Integration Guide

This guide explains how to use the enhanced video playback system with real camera integration and mock feedback.

## 🎯 Overview

The enhanced system provides:
- ✅ **Real camera capture** with automatic snapshot processing
- ✅ **Video playback** with beat synchronization
- ✅ **Mock feedback system** for testing without backend
- ✅ **Integrated UI** with existing components
- ✅ **Beat timeline** with visual feedback
- ✅ **Real-time pose comparison** (mock)

## 📁 New Components

### 1. VideoPlayer Component
```tsx
import { VideoPlayer } from '../components/VideoPlayer';

<VideoPlayer
  videoSrc="/videos/magnetic.mp4"
  isPlaying={isPlaying}
  currentTime={currentTime}
  duration={duration}
  onTimeUpdate={setCurrentTime}
  onLoadedMetadata={setDuration}
  onPlayPause={() => setIsPlaying(!isPlaying)}
  onRestart={() => setCurrentTime(0)}
  playbackRate={1}
  mirror={false}
  showSkeleton={false}
/>
```

### 2. useVideoBeatSync Hook
```tsx
import { useVideoBeatSync } from '../hooks/useVideoBeatSync';

const { state: beatState } = useVideoBeatSync({
  bpm: 114,
  totalBeats: 48,
  videoCurrentTime,
  videoDuration,
  onBeatChange: (beat) => console.log('Beat changed:', beat),
});
```

### 3. Mock Feedback Service
```tsx
import { mockFeedbackService } from '../services/mockFeedbackService';

const feedback = await mockFeedbackService.processSnapshot(imageData, {
  baseScore: 0.75,
  feedbackFrequency: 0.3,
  includeErrors: true
});
```

## 🚀 Usage Example

### Basic Integration
```tsx
import { EnhancedPracticePage } from '../pages/EnhancedPracticePage';

function App() {
  return (
    <EnhancedPracticePage
      routineId="1"
      onBack={() => console.log('Back')}
      onReview={() => console.log('Review')}
      onSettings={() => console.log('Settings')}
    />
  );
}
```

### Custom Integration
```tsx
import { LiveCameraView } from '../components/LiveCameraView';
import { VideoPlayer } from '../components/VideoPlayer';
import { useSnapshotCapture } from '../hooks/useSnapshotCapture';
import { mockFeedbackService } from '../services/mockFeedbackService';

function CustomPracticePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const { captureSnapshot } = useSnapshotCapture({
    autoCapture: true,
    captureInterval: 500,
    onSnapshotProcessed: setFeedback
  });

  const handleSnapshot = async (snapshot: string) => {
    const result = await mockFeedbackService.processSnapshot(snapshot);
    setFeedback(result);
  };

  return (
    <div className="flex gap-4">
      {/* Camera View */}
      <div className="w-1/2">
        <LiveCameraView
          onSnapshot={handleSnapshot}
          autoSnapshot={isPlaying}
          snapshotInterval={500}
        />
      </div>

      {/* Video Player */}
      <div className="w-1/2">
        <VideoPlayer
          videoSrc="/videos/magnetic.mp4"
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onRestart={() => setCurrentTime(0)}
        />
      </div>
    </div>
  );
}
```

## 🎥 Video Setup

### 1. Add Video Files
Place your reference videos in `frontend/public/videos/`:
```
frontend/public/videos/
├── magnetic.mp4
├── kill-this-love.mp4
├── go.mp4
└── fancy.mp4
```

### 2. Video Requirements
- **Format**: MP4 (H.264)
- **Resolution**: 720p or 1080p
- **Duration**: Match your routine duration
- **Audio**: Include audio for beat synchronization

### 3. Video Naming Convention
Videos should match the routine titles in `mockData.ts`:
```typescript
// mockData.ts
{
  id: '1',
  title: 'Magnetic', // → magnetic.mp4
  artist: 'ILLIT',
  // ...
}
```

## 🎵 Beat Synchronization

### How It Works
1. **BPM Calculation**: Uses routine BPM to calculate beat timing
2. **Video Sync**: Syncs video playback with beat timeline
3. **Visual Feedback**: Shows current beat position on timeline
4. **Error Regions**: Highlights problematic beat sections

### Beat Timeline Features
- **Segments**: Shows different song sections
- **Beat Ticks**: Visual beat markers
- **Playhead**: Current position indicator
- **Error Regions**: Red markers for difficult sections

## 📸 Camera Integration

### Automatic Snapshot Capture
- **Interval**: 500ms (0.5 seconds)
- **Format**: Base64 JPEG (80% quality)
- **Mirror**: Automatic mirroring support
- **Queue**: Automatic queue management

### Snapshot Processing
```tsx
const handleSnapshot = async (snapshot: string) => {
  // 1. Capture frame from camera
  // 2. Convert to base64
  // 3. Send to mock service (or real API)
  // 4. Receive feedback
  // 5. Update UI with results
};
```

## 🎯 Mock Feedback System

### Features
- **Realistic Scores**: Generates believable pose similarity scores
- **Varied Feedback**: Different types of feedback messages
- **Error Simulation**: Simulates pose errors and corrections
- **Configurable**: Adjustable feedback frequency and content

### Configuration Options
```tsx
const feedback = await mockFeedbackService.processSnapshot(imageData, {
  baseScore: 0.75,        // Base similarity score (0-1)
  scoreVariation: 0.2,    // How much scores vary
  feedbackFrequency: 0.3, // How often to provide feedback (0-1)
  includeErrors: true     // Whether to include error messages
});
```

### Feedback Types
- **Positive**: "Great form! Keep it up!"
- **Corrective**: "Raise left elbow ~12° higher"
- **Encouraging**: "You're doing amazing!"
- **Timing**: "Try to stay in sync with the music"

## 🔧 Customization

### Styling
All components use Tailwind CSS and match the existing design system:
- **Colors**: Purple/cyan gradient theme
- **Typography**: Arimo font family
- **Animations**: Framer Motion transitions
- **Layout**: Responsive grid system

### Performance
- **Frame Skipping**: Automatic throttling to prevent overwhelming
- **Memory Management**: Automatic cleanup of old snapshots
- **Canvas Optimization**: Efficient frame capture and processing

## 🚀 Next Steps

### 1. Add Real Backend Integration
Replace `mockFeedbackService` with real API calls:
```tsx
// Replace this:
const feedback = await mockFeedbackService.processSnapshot(snapshot);

// With this:
const feedback = await poseAPI.sendSnapshot(snapshot);
```

### 2. Add More Video Controls
- Speed adjustment (0.5x, 0.75x, 1x, 1.25x)
- Loop controls (8 beats, 16 beats)
- Segment jumping

### 3. Enhanced Feedback
- Real-time pose overlay
- Skeleton visualization
- Progress tracking
- Session analytics

### 4. Performance Optimization
- WebGL rendering for skeleton overlay
- Web Workers for snapshot processing
- Video streaming optimization

## 🐛 Troubleshooting

### Common Issues

1. **Video not loading**
   - Check file path in `public/videos/`
   - Verify video format (MP4 H.264)
   - Check browser console for errors

2. **Camera not working**
   - Check browser permissions
   - Verify HTTPS connection
   - Try different browser

3. **Feedback not appearing**
   - Check `autoSnapshot` is enabled
   - Verify `onSnapshot` callback is provided
   - Check browser console for errors

4. **Beat sync issues**
   - Verify BPM is correct in routine data
   - Check video duration matches routine duration
   - Ensure video has audio track

### Debug Mode
Enable debug logging:
```tsx
// Add to component
useEffect(() => {
  console.log('Beat state:', beatState);
  console.log('Video time:', videoCurrentTime);
  console.log('Feedback:', currentFeedback);
}, [beatState, videoCurrentTime, currentFeedback]);
```

## 📝 Example Backend Integration

When ready to integrate with real backend:

```tsx
// Replace mock service with real API
import { poseAPI } from '../services/api';

const handleSnapshot = async (snapshot: string) => {
  try {
    const feedback = await poseAPI.sendSnapshot(snapshot);
    setCurrentFeedback(feedback);
    
    if (feedback.comparison_result) {
      const accuracy = Math.round(feedback.comparison_result.combined_score * 100);
      setOverallAccuracy(accuracy);
    }
  } catch (error) {
    console.error('API error:', error);
  }
};
```

This enhanced system provides a solid foundation for real-time pose comparison with video playback and camera integration!
