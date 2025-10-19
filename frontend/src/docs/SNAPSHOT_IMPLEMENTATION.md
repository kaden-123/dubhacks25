# Camera Snapshot Implementation Guide

This document explains how to use the camera snapshot functionality to capture video frames and send them to an API for pose analysis.

## 🎯 Overview

The snapshot system allows you to:
- Capture video frames from the live camera feed
- Convert frames to base64 data URLs
- Queue snapshots for batch processing
- Send snapshots to your backend API
- Handle mirror transformations correctly
- Manage processing queues and error handling

## 📁 File Structure

```
frontend/src/
├── components/
│   └── LiveCameraView.tsx          # Main camera component with snapshot capability
├── services/
│   └── snapshotService.ts          # Service for managing snapshots and API calls
├── hooks/
│   └── useSnapshotCapture.ts       # React hook for easy integration
├── examples/
│   └── SnapshotExample.tsx         # Complete usage example
└── docs/
    └── SNAPSHOT_IMPLEMENTATION.md  # This documentation
```

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { LiveCameraView } from '../components/LiveCameraView';

function MyComponent() {
  const handleSnapshot = (frameBase64: string) => {
    console.log('Captured snapshot:', frameBase64);
    // Send to your API
  };

  return (
    <LiveCameraView 
      onSnapshot={handleSnapshot}
      autoSnapshot={true}
      snapshotInterval={500}
    />
  );
}
```

### 2. Advanced Usage with Hook

```tsx
import { useSnapshotCapture } from '../hooks/useSnapshotCapture';
import { LiveCameraView } from '../components/LiveCameraView';

function PracticePage() {
  const {
    captureSnapshot,
    processQueue,
    queueStatus,
    isCapturing,
    startAutoCapture,
    stopAutoCapture
  } = useSnapshotCapture({
    autoCapture: true,
    captureInterval: 500,
    apiEndpoint: 'http://localhost:8000/api/analyze-pose',
    onSnapshotProcessed: (result) => {
      console.log('Analysis result:', result);
    }
  });

  return (
    <LiveCameraView 
      onSnapshot={captureSnapshot}
      autoSnapshot={isCapturing}
      snapshotInterval={500}
    />
  );
}
```

## 🔧 API Reference

### LiveCameraView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSnapshot` | `(snapshot: string) => void` | - | Callback when snapshot is captured |
| `autoSnapshot` | `boolean` | `false` | Enable automatic snapshot capture |
| `snapshotInterval` | `number` | `500` | Interval between snapshots (ms) |
| `showMirrorButton` | `boolean` | `true` | Show mirror toggle button |
| `mirrorButtonPosition` | `'top-right' \| 'bottom-center'` | `'top-right'` | Position of mirror button |

### useSnapshotCapture Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoCapture` | `boolean` | `false` | Enable automatic capture |
| `captureInterval` | `number` | `500` | Capture interval (ms) |
| `maxQueueSize` | `number` | `100` | Maximum queue size |
| `apiEndpoint` | `string` | - | API endpoint for processing |
| `onSnapshotProcessed` | `(result: any) => void` | - | Callback for processed results |
| `onError` | `(error: Error) => void` | - | Error callback |

### useSnapshotCapture Return

| Property | Type | Description |
|----------|------|-------------|
| `captureSnapshot` | `(frameBase64: string, data?: Partial<SnapshotData>) => void` | Manually capture snapshot |
| `processQueue` | `() => Promise<void>` | Process queued snapshots |
| `queueStatus` | `{ size: number, isProcessing: boolean }` | Current queue status |
| `clearQueue` | `() => void` | Clear the snapshot queue |
| `isCapturing` | `boolean` | Whether auto-capture is active |
| `startAutoCapture` | `() => void` | Start auto-capture |
| `stopAutoCapture` | `() => void` | Stop auto-capture |

## 📊 Data Flow

```
Camera Feed → Canvas Capture → Base64 Conversion → Queue → API Processing → Results
     ↓              ↓                ↓              ↓           ↓            ↓
  Video Element → Canvas.drawImage → toDataURL → snapshotService → HTTP POST → onSnapshotProcessed
```

## 🔄 Snapshot Lifecycle

1. **Capture**: Video frame is drawn to hidden canvas
2. **Transform**: Mirror transformation applied if needed
3. **Encode**: Canvas converted to base64 JPEG (80% quality)
4. **Queue**: Snapshot added to processing queue
5. **Process**: Queue processed in batches (5 snapshots per batch)
6. **API Call**: Snapshots sent to backend API
7. **Result**: Analysis results returned via callback

## 🛠 Backend API Integration

### Expected API Endpoints

#### Single Snapshot
```http
POST /api/analyze-pose
Content-Type: application/json

{
  "frame_base64": "data:image/jpeg;base64,/9j/4AAQ...",
  "timestamp": 1703123456789
}
```

#### Batch Processing
```http
POST /api/analyze-pose/batch
Content-Type: application/json

{
  "snapshots": [
    {
      "frame_base64": "data:image/jpeg;base64,/9j/4AAQ...",
      "timestamp": 1703123456789
    },
    // ... more snapshots
  ]
}
```

#### File Upload (Alternative)
```http
POST /api/analyze-pose/upload
Content-Type: multipart/form-data

image: [binary file]
timestamp: "1703123456789"
```

### Expected Response Format

```json
{
  "success": true,
  "analysis": {
    "pose_similarity": 0.85,
    "motion_similarity": 0.78,
    "combined_score": 0.82,
    "errors": [
      {
        "joint": "left_elbow",
        "error": "Raise left elbow ~12° higher",
        "severity": "medium"
      }
    ],
    "best_match_idx": 15,
    "reference_timestamp": 12.5,
    "timing_offset": -0.3
  }
}
```

## ⚡ Performance Considerations

### Optimization Tips

1. **Quality Settings**: JPEG quality set to 80% for smaller file sizes
2. **Throttling**: Minimum 100ms between snapshots to prevent overwhelming
3. **Batch Processing**: Snapshots processed in batches of 5
4. **Queue Management**: Automatic cleanup of old snapshots
5. **Error Handling**: Graceful degradation on API failures

### Memory Management

- Snapshots are automatically removed from queue after processing
- Canvas is reused for all captures (no memory leaks)
- Base64 strings are garbage collected after API calls

## 🐛 Troubleshooting

### Common Issues

1. **Camera not found**: Check browser permissions
2. **Snapshots not capturing**: Verify `onSnapshot` callback is provided
3. **API errors**: Check network connectivity and endpoint URL
4. **Memory issues**: Reduce `maxQueueSize` or increase processing frequency

### Debug Information

Enable debug logging by checking browser console:
- Camera initialization steps
- Snapshot capture events
- API request/response details
- Queue status updates

## 🔒 Security Considerations

1. **HTTPS Required**: Camera access requires secure context
2. **Data Privacy**: Base64 images contain user video data
3. **API Security**: Implement proper authentication for your backend
4. **Data Retention**: Consider implementing data cleanup policies

## 📝 Example Backend Integration

```python
# FastAPI example
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import cv2
import numpy as np

app = FastAPI()

class SnapshotRequest(BaseModel):
    frame_base64: str
    timestamp: int

@app.post("/api/analyze-pose")
async def analyze_pose(request: SnapshotRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.frame_base64.split(',')[1])
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Your pose analysis logic here
        result = analyze_pose_in_image(image)
        
        return {
            "success": True,
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🎯 Next Steps

1. **Integrate with your backend**: Update API endpoints in `snapshotService.ts`
2. **Customize processing**: Modify batch sizes and intervals as needed
3. **Add error recovery**: Implement retry logic for failed API calls
4. **Optimize performance**: Adjust quality settings based on your needs
5. **Add analytics**: Track snapshot capture and processing metrics

This implementation provides a robust foundation for real-time pose analysis with your K-Pop dance trainer application!
