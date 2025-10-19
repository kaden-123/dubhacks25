K-Pop Dance Training App - High-Level Architecture Design
Let me focus purely on the architectural decisions and design rationale without code.

1. FRONTEND-BACKEND SEPARATION
Decision: Separated Architecture with Hybrid Communication
Why separate?
Modularity: Frontend team can work on UI while backend team works on ML/processing
Technology optimization: React excels at UI, Python excels at ML/computer vision
Testing: Can test pose detection logic independently from UI
Future scalability: Easier to add mobile apps later that use same backend
Communication Strategy:
WebSocket for real-time data: During active dancing, frames flow continuously from frontend → backend, pose data + immediate errors flow back
REST API for everything else: Video uploads, session initialization, retrieving final feedback, analytics
Data Flow:
User starts session → REST POST creates session, returns session_id
User clicks "start dance" → WebSocket connection established
During dance → Frontend sends frames via WebSocket ~10 FPS, Backend responds with pose landmarks + immediate error flags
User finishes section → WebSocket closes, REST GET retrieves detailed feedback
Final analytics → REST GET retrieves complete session analysis

2. BACKEND FRAMEWORK DECISION
Recommendation: FastAPI
FastAPI vs Flask comparison:
Aspect
Flask
FastAPI
WebSocket support
Requires extensions (Flask-SocketIO)
Native, built-in
Async support
Bolted-on, not native
Native async/await
Type validation
Manual
Automatic via Pydantic
API docs
Manual
Auto-generated Swagger UI
Performance
Moderate
Higher (ASGI-based)
Learning curve
Gentler
Slightly steeper

For your hackathon: FastAPI wins because:
You need WebSockets for real-time pose streaming
Video processing benefits from async operations
Type hints prevent bugs during rapid development
Auto-generated API docs help team coordination
Modern stack looks impressive to judges

3. PROCESSING STRATEGY: Real-Time vs Batch
Hybrid Approach (Recommended)
During dance session (Real-time):
Extract poses from each frame as they arrive
Perform lightweight comparison against reference
Return immediate errors (only major issues: "left arm too low")
Store all data in memory for later analysis
Why real-time processing?
Immediate feedback feels responsive
Can show skeleton overlay in real-time
Detects if person left frame or pose detection failed
After dance section (Batch):
Analyze entire sequence of poses collected
Identify patterns and trends
Generate detailed feedback via LLM
Calculate comprehensive analytics
Why batch processing?
LLM calls are too slow for real-time (2-5 seconds)
Can analyze temporal patterns (did they progressively improve?)
Can identify which specific moves in choreography were hardest
More sophisticated algorithms without time pressure
Data Storage During Session:
Everything kept in-memory (Python dictionaries/lists)
No database needed for hackathon
Session persists only during active use
Could add simple JSON file persistence if needed for demos

4. BACKEND ARCHITECTURE LAYERS
Layer 1: API Layer (FastAPI routes)
Responsibility: Receive HTTP/WebSocket requests, validate inputs, return responses
Does NOT: Contain business logic or ML code
Components:
REST endpoints for session management
WebSocket handler for frame streaming
Request/response models (Pydantic schemas)
Layer 2: Orchestration Layer (Processing Coordinator)
Responsibility: Coordinates between different services, manages processing pipeline flow
Key decisions made here:
When to trigger reference video preprocessing
How to match user frames to reference frames (by timestamp)
When to generate feedback (after section vs after full dance)
What data to keep vs discard
Does NOT: Perform actual pose detection or comparison
Layer 3: Service Layer (Specialized modules)
Each service has ONE clear responsibility:
a) Pose Extraction Service
Wraps MediaPipe
Converts images → 33 landmark coordinates
Handles both video files (reference) and base64 frames (user webcam)
b) Pose Normalization Service
Critical for accuracy: Makes poses comparable despite position/scale differences
Normalizes based on torso (hip-shoulder midpoint becomes origin)
Scales based on torso length (unit normalization)
Rotates to align body orientation
Output: position/scale/rotation-invariant pose representation
c) Comparison Engine
Compares normalized user pose vs reference pose
Uses angle-based metrics not raw coordinates (why: scale-invariant)
Calculates specific joint angles (elbow, knee, hip, shoulder angles)
Calculates relative distances (hand spread, foot width)
Returns accuracy score + list of specific errors
d) Scoring Service
Aggregates frame-by-frame comparisons
Calculates overall accuracy percentage
Identifies temporal patterns (improving vs degrading)
Generates quantitative metrics for analytics
e) Feedback Generation Service
Takes comparison data + problem segments
Calls LLM with structured prompt
Converts technical errors → human-readable advice
Returns timestamped feedback items
Layer 4: Utility Layer
Video processing helpers (frame extraction, encoding)
Geometry calculations (angles, distances, rotations)
Data structure definitions (shared types)
Why this layering?
Single Responsibility: Each layer has one job
Testability: Can unit test each service independently
Replaceability: Can swap MediaPipe for different pose detector without touching other code
Parallel development: Different team members can own different services

5. THE NORMALIZATION PROBLEM (Most Critical Technical Challenge)
Problem Statement:
You can't just compare raw (x,y,z) coordinates because:
User might stand left of center, reference dancer is centered → all x-coordinates differ
User might be closer/farther from camera → scale is different
User might be taller/shorter → proportions differ
Camera angle might differ slightly
Solution: Multi-Stage Normalization
Stage 1: Translation (Position Invariance)
Calculate "body center" (midpoint of hips + shoulders)
Subtract body center from all landmarks
Now everyone is "centered" regardless of frame position
Stage 2: Scale Normalization (Size Invariance)
Calculate "torso length" (distance shoulder center → hip center)
Divide all coordinates by torso length
Now a tall person and short person have same-scale poses
Stage 3: Rotation Alignment (Orientation Invariance)
Calculate torso vector direction
Rotate entire pose so torso points "upward"
Now a person facing slightly left/right is aligned
Stage 4: Comparison Using Angles (Proportion Invariance)
Instead of comparing coordinates, compare joint angles
Elbow angle: angle between shoulder→elbow→wrist
Knee angle: angle between hip→knee→ankle
Angles are invariant to body proportions (long arms vs short arms gives same angle)
Why angles over distances?
Two people doing same pose with different arm lengths → same angles, different distances
Angles capture "shape" of pose independent of size

6. LLM INTEGRATION ARCHITECTURE
LLM Provider: OpenAI (GPT-4o-mini)
This project uses OpenAI exclusively for LLM-powered feedback generation.
✅ Simple API integration
✅ Fast setup for hackathon timeline
✅ Cost-effective for demo scale
✅ Reliable performance with conversational responses

When to Call LLM:
NOT during real-time processing (too slow, 2-5 second latency)
ONLY after dance section completes (batch processing)
Generate 3-5 feedback items per section
What Data to Send to LLM:
Input Structure:
For each problem segment:
- Timestamp range (e.g., seconds 12-15)
- List of specific errors detected:
  - "Left elbow angle: user had 95°, reference had 145° (error: 50°)"
  - "Right knee angle: user had 160°, reference had 110° (error: 50°)"
  - "Torso lean: user leaning 15° forward, reference upright"
- Reference video frame at that timestamp (description)
- User's performance trend (getting worse/better)

LLM Prompt Strategy:
You are a dance instructor. A student just attempted a K-pop dance move.
Here are the technical errors detected:
[structured error data]

Generate friendly, actionable feedback:
1. What went wrong (in plain English)
2. Why it matters for the choreography
3. Specific correction steps
4. Encouragement

Keep it under 100 words, conversational tone.

Output Format:
{
  "timestamp": 12.5,
  "title": "Arm Position During Chorus",
  "feedback": "Your left arm isn't extending fully...",
  "severity": "medium",
  "body_parts": ["left_arm", "elbow"]
}

7. CAMERA INTEGRATION WITH REACT
Browser WebRTC API
Modern browsers provide getUserMedia() API for webcam access.
Library Options:
react-webcam (Recommended):
Wrapper around native WebRTC
Handles permissions automatically
Provides getScreenshot() method → base64 image
Simplest integration
Native getUserMedia:
More control
More complex
Overkill for this project
Frame Capture Strategy:
Option A: Interval-based (Recommended)
Capture frame every 100ms (10 FPS)
Send each frame to backend via WebSocket
Sufficient for pose detection
Reduces bandwidth vs 30 FPS
Option B: requestAnimationFrame
Capture at monitor refresh rate (60 FPS)
Too much data, unnecessary
Pose detection doesn't need 60 FPS
Frame Format:
Capture as JPEG via getScreenshot()
Returns base64 string
Send directly over WebSocket (no additional encoding)
Backend decodes base64 → numpy array → MediaPipe

8. DATA FORMATS BETWEEN LAYERS
Frontend → Backend (WebSocket):
{
  "type": "frame",
  "data": "data:image/jpeg;base64,/9j/4AAQ...",  // base64 image
  "timestamp": 12.456,  // seconds since dance start
  "session_id": "abc123"
}

Backend → Frontend (WebSocket Real-time):
{
  "pose_landmarks": [
    {"x": 0.5, "y": 0.3, "z": -0.1, "visibility": 0.99},
    // ... 33 landmarks total
  ],
  "immediate_errors": [
    {
      "body_part": "left_elbow",
      "message": "Bend your left arm more",
      "severity": "medium"
    }
  ],
  "accuracy": 0.72,
  "timestamp": 12.456
}

Backend → Frontend (REST - Final Feedback):
{
  "session_id": "abc123",
  "overall_accuracy": 0.78,
  "problem_segments": [
    {
      "start_time": 8.2,
      "end_time": 12.5,
      "title": "Chorus Section",
      "feedback": "Your arm positioning needs work...",
      "video_clip": "/api/sessions/abc123/clips/1"
    }
  ],
  "analytics": {
    "total_frames": 450,
    "average_accuracy": 0.78,
    "best_move": "Opening pose",
    "hardest_move": "Spin at 0:15"
  }
}


9. REFERENCE VIDEO PREPROCESSING
When: Before any user dancing begins
Process:
User uploads K-pop reference video (or selects from library)
Backend receives video file
Preprocessing pipeline (runs once):
Extract every frame (or every Nth frame)
Run MediaPipe on each frame
Normalize all poses
Store in memory as: [(timestamp, normalized_landmarks), ...]
Now system is ready for real-time comparison
Why preprocess?
Reference video doesn't change
Would be wasteful to re-extract poses every time
Enables instant lookup during real-time processing
Storage: For hackathon (in-memory):
{
  "reference_abc123": {
    "fps": 30,
    "duration": 45.2,
    "poses": [
      {"timestamp": 0.033, "landmarks": [...], "frame_num": 1},
      {"timestamp": 0.066, "landmarks": [...], "frame_num": 2},
      // ...
    ]
  }
}

For production (would add database):
Store processed poses in PostgreSQL or MongoDB
Store original video in S3/cloud storage
Cache in Redis for active sessions

10. SESSION MANAGEMENT
Session Lifecycle:
1. Session Creation (REST)
POST /api/sessions/create
Receives: reference_video_id
Returns: session_id
Backend: Loads reference poses into memory
2. Active Dancing (WebSocket)
Frontend connects: ws://localhost:8000/ws/{session_id}
Streams frames → receives pose data
All frame data stored in session object (in-memory list)
3. Section Completion (REST)
POST /api/sessions/{session_id}/complete-section
Backend: Triggers LLM feedback generation
Returns: Feedback for that section
4. Session Finalization (REST)
POST /api/sessions/{session_id}/finalize
Backend: Generates complete analytics
Returns: Full session report
Optionally: Cleanup memory
In-Memory Session Storage:
# Simplified structure
sessions = {
  "session_abc123": {
    "reference_poses": [...],
    "user_frames": [],  # Collected during WebSocket
    "comparisons": [],  # Results of each comparison
    "status": "active",
    "created_at": datetime
  }
}

Memory considerations:
Each frame: ~200KB (base64 image) + ~5KB (landmarks)
30-second dance @ 10 FPS = 300 frames = ~60MB per session
For hackathon demo: Fine to keep in RAM
For production: Would stream to temp files or S3

11. FRONTEND STATE MANAGEMENT
State Architecture:
Session State (useSession hook or Context):
current_session_id
reference_video_url
dance_status: 'idle' | 'dancing' | 'reviewing' | 'complete'
current_timestamp
Real-time State (WebSocket updates):
user_pose_landmarks (for skeleton overlay)
immediate_errors (banner notifications)
current_accuracy (live score display)
Feedback State (after section):
problem_segments[]
ai_feedback[]
video_clips[]
Component Communication:
App
├── DanceSession (manages overall flow)
│   ├── VideoDisplay
│   │   ├── ReferenceVideo
│   │   └── WebcamCapture (sends frames via WebSocket)
│   │       └── SkeletonOverlay (receives pose landmarks)
│   ├── LiveFeedback (shows immediate errors)
│   └── Controls (start/stop/next section)
└── FeedbackReview (shows after section)
    ├── ProblemSegmentCard[]
    │   ├── VideoComparison (side-by-side)
    │   └── AIFeedback
    └── Analytics


12. VIDEO SYNCHRONIZATION
Challenge:
Reference video and user webcam need to stay in sync so comparisons are accurate.
Solution: Timestamp-Based Matching
Frontend responsibility:
Track elapsed time since "start" button clicked
Send timestamp with each webcam frame
Control reference video playback to stay synced
Backend responsibility:
Use timestamp to find matching reference pose
Interpolate if exact timestamp not available
Edge cases to handle:
User pauses → stop sending frames, pause reference
User falls behind → slow down or pause reference video
Connection lag → timestamps still valid, just delayed processing

13. ADDITIONAL LIBRARIES TO CONSIDER
Backend:
opencv-python: Video file handling, frame extraction
numpy: Array operations, numerical calculations
scipy: Advanced geometry operations (optional)
python-multipart: File uploads in FastAPI
python-dotenv: Environment variable management
pydantic: Data validation (built into FastAPI)
Frontend:
react-webcam: Webcam access
recharts or chart.js: Analytics visualizations
framer-motion: Smooth UI animations
react-player: Reference video playback
zustand or redux: State management (optional, Context API might be enough)

14. EDGE CASES & ERROR HANDLING
Pose Detection Failures:
Problem: MediaPipe can't detect person (turned around, out of frame)
Solution: Return null landmarks, show warning on frontend, don't penalize accuracy
Timestamp Misalignment:
Problem: User pauses, or network lag causes drift
Solution: Frontend tracks "dance time" separately from real time, can pause/resume
Different Video Lengths:
Problem: User finishes dance faster/slower than reference
Solution: For now, require strict sync. Future: time-warping algorithm (DTW)
Multiple People in Frame:
Problem: MediaPipe detects wrong person or multiple people
Solution: Track pose that's most centered and consistent across frames
Lighting/Background Issues:
Problem: Poor webcam quality affects detection
Solution: Show confidence scores, warn user about poor conditions
LLM Failures:
Problem: API timeout or rate limit
Solution: Fallback to template-based feedback ("Your left elbow angle was off by X degrees")

15. HACKATHON OPTIMIZATION STRATEGIES
MVP Scope (Must Have):
✅ Single reference video (hard-coded)
✅ Real-time pose detection + overlay
✅ Post-dance feedback (2-3 problems identified)
✅ Basic accuracy score
Nice to Have (If Time):
Multiple reference videos to choose from
Real-time error notifications during dance
Beautiful analytics dashboard
Video replay of user performance
Progress tracking across attempts
Demo Strategy:
Pre-process reference video before demo starts
Test with 15-20 second dance clips (not full songs)
Have backup video files ready
Test lighting conditions beforehand
Rehearse the demo dance move yourself
Time Allocation (Typical Hackathon):
Hour 0-4: Setup + architecture + basic backend
Hour 4-8: Pose detection + normalization working
Hour 8-12: Frontend + WebSocket integration
Hour 12-16: LLM integration + feedback display
Hour 16-20: UI polish + testing
Hour 20-24: Bug fixes + demo preparation

SUMMARY: Key Architectural Decisions
Separated frontend/backend with WebSocket + REST hybrid communication
FastAPI backend for native async and WebSocket support
Hybrid processing: Real-time for responsiveness + batch for deep analysis
Layered backend: API → Orchestration → Services → Utilities
Angle-based comparison after normalization to handle position/scale/proportion differences
LLM only for post-processing to convert technical errors → human feedback
In-memory storage for hackathon, easy to add persistence later
10 FPS frame capture balances quality and bandwidth
Timestamp-based sync between reference and user performance
Modular services allow parallel development and easy testing
This architecture is production-ready in structure but hackathon-optimized in scope — you can build the MVP quickly, demo impressively, and easily extend later.

