# Backend Architecture

## Overview

This document describes the complete architecture for the **K-Pop Dance Trainer Backend** - a real-time pose analysis and feedback system.

**Status:** ✅ Production Ready (Post-Cleanup)
**Last Updated:** 2025-01-18
**Version:** 2.0

For complete process flow, see: `COMPLETE_BACKEND_FLOW.md`
For security requirements, see: `SECURITY.md`

---

## 📁 Clean File Structure

```
backend/
├── app/
│   ├── main.py                          # ⭐ UNIFIED API (FastAPI)
│   ├── data/
│   │   ├── config.py                    # Configuration
│   │   └── processed_poses/             # Reference videos (.npy)
│   └── services/                        # Internal services
│       ├── pose_comparison_service.py   # Core comparison
│       ├── pose_comparison_config.py    # Comparison config
│       ├── live_feedback_service.py     # Real-time AI (OpenAI Vision)
│       ├── feedback_generation.py       # Summary AI (OpenAI Text)
│       ├── scoring.py                   # Score tracking
│       ├── angle_calculator.py          # Joint angles
│       ├── pose_extraction.py           # Preprocessing
│       ├── pose_normalization.py        # Preprocessing
│       └── process_video_pose.py        # Preprocessing
└── tests/                               # Test files
```

**Files Removed (Cleanup):**
- ❌ `comparison_engine.py` - Empty duplicate
- ❌ `livepose.py` - Duplicate FastAPI app
- ❌ `dance_session_client.py` - Test client
- ❌ `test_client.py` - Test client
- ❌ `webcam_comparison.py` - Demo script

---

## 🏗️ Architecture Layers

### **1. API Layer (main.py)**
- Single unified FastAPI application
- 15 REST endpoints organized by domain
- Calls internal services
- Returns ONLY processed data (no LLM metadata)

### **2. Services Layer (Internal)**
- Never exposed to API
- Encapsulated business logic
- LLM services (OpenAI) are internal only

### **3. Data Layer**
- Configuration from `.env`
- Reference poses from `.npy` files
- Session state in memory

---

# Live Feedback Generation System

## Overview

Real-time feedback interface that generates LLM-powered guidance every 0.5 seconds during active dancing.

## System Components

### 1. Live Feedback Service (`live_feedback_service.py`)

**Purpose**: Generate real-time feedback during active dancing

**Key Features**:
- Processes snapshot data every 0.5 seconds (2 Hz)
- Maintains rolling context window (last 3 seconds)
- Uses OpenAI Vision API for image-based analysis
- Tracks performance trends and persistent issues
- Manages rate limiting and fallback strategies

**Interface**:
```python
class LiveFeedbackService:
    def process_snapshot(snapshot: SnapshotData, force_feedback: bool = False) -> Optional[Dict[str, Any]]
    def reset()  # Reset for new section/session
    def get_statistics() -> Dict[str, Any]
```

**Data Model**:
```python
@dataclass
class SnapshotData:
    timestamp: float
    frame_base64: str  # Video snapshot for Vision API
    pose_similarity: float
    motion_similarity: float
    combined_score: float
    errors: List[Dict[str, Any]]
    best_match_idx: int
    reference_timestamp: float
    timing_offset: float
```

**Output Format**:
```json
{
  "timestamp": 12.5,
  "feedback_text": "Extend your left arm more!",
  "severity": "medium",
  "focus_areas": ["left_arm", "elbow"],
  "is_positive": false,
  "context": {
    "average_score": 0.68,
    "trend": "stable",
    "persistent_issues": ["left_elbow"],
    "timing_offset": -0.3
  }
}
```

---

### 2. Post-Section Feedback Service (`feedback_generation.py`)

**Purpose**: Generate comprehensive feedback after dance sections complete

**Key Features**:
- Batch processing of problem segments
- Analyzes patterns across entire section
- Generates 3-5 detailed feedback items
- Text-based LLM prompts with aggregated data

**Interface**:
```python
class FeedbackGenerationService:
    def generate_feedback(problem_segments: List[Dict], max_items: int = None) -> List[Dict[str, Any]]
```

**Status**: ✅ Already implemented - no changes needed for live feedback

---

### 3. Post-Session Summary (New Requirement)

**Purpose**: Generate comprehensive session summary with timeline and analytics

**When**: After entire dance session completes

**Components Involved**:

#### A. Scoring Service (`scoring.py`) - NEEDS IMPLEMENTATION
**Responsibilities**:
- Aggregate all snapshot scores collected during session
- Calculate timeline of performance scores
- Identify problem areas (body parts, timing segments)
- Generate statistics (average score, best/worst moments)

**Interface** (Proposed):
```python
class ScoringService:
    def __init__(self):
        self.session_scores = []  # All scores from session
        self.session_snapshots = []  # All snapshots

    def add_score(self, timestamp: float, combined_score: float, pose_score: float, motion_score: float):
        """Record score for timeline"""
        pass

    def get_timeline(self, resolution: str = "0.5s") -> List[Dict]:
        """
        Returns:
        [
            {"timestamp": 0.0, "score": 0.85, "label": "Great!"},
            {"timestamp": 0.5, "score": 0.72, "label": "Good"},
            ...
        ]
        """
        pass

    def identify_problem_areas(self, threshold: float = 0.65) -> List[Dict]:
        """
        Returns segments where score < threshold:
        [
            {
                "start_time": 8.2,
                "end_time": 12.5,
                "average_score": 0.58,
                "body_parts": ["left_elbow", "right_knee"],
                "error_count": 15
            }
        ]
        """
        pass

    def get_session_statistics(self) -> Dict:
        """
        Returns:
        {
            "total_duration": 45.2,
            "average_score": 0.78,
            "best_moment": {"timestamp": 23.4, "score": 0.95},
            "worst_moment": {"timestamp": 12.1, "score": 0.42},
            "total_frames": 904,
            "problem_segments_count": 3
        }
        """
        pass

    def reset(self):
        """Clear session data"""
        pass
```

#### B. Session Summary Generator (New Service) - NEEDS IMPLEMENTATION
**Location**: `backend/app/services/session_summary_service.py`

**Responsibilities**:
- Coordinate between scoring, feedback, and comparison services
- Generate final summary with all components
- Optional: Call LLM to generate natural language summary

**Interface** (Proposed):
```python
class SessionSummaryService:
    def __init__(self, scoring_service: ScoringService, feedback_service: FeedbackGenerationService):
        pass

    def generate_summary(self) -> Dict[str, Any]:
        """
        Generate complete session summary

        Returns:
        {
            "session_id": "abc123",
            "statistics": {...},  # From ScoringService
            "timeline": [...],    # From ScoringService
            "problem_areas": [...],  # From ScoringService
            "detailed_feedback": [...],  # From FeedbackGenerationService
            "overall_assessment": "You did great! Focus on...",  # Optional: LLM-generated
            "improvement_suggestions": [...]
        }
        """
        pass
```

#### C. Files Involved:

**Current Implementation Status**:

| File | Status | Role |
|------|--------|------|
| `live_feedback_service.py` | ✅ Implemented | Real-time feedback during dance |
| `feedback_generation.py` | ✅ Exists (no changes needed) | Post-section detailed feedback |
| `pose_comparison_service.py` | ✅ Exists | Generates scores/errors per snapshot |
| `scoring.py` | ⚠️ Empty/Needs Implementation | Timeline & statistics |
| `session_summary_service.py` | ❌ Doesn't exist | Coordinate final summary |

---

## Data Flow

### During Active Dancing (0.5s intervals):

```
Snapshot (frame + pose data)
    ↓
LiveFeedbackService.process_snapshot()
    ↓
[Optional] Generate immediate feedback
    ↓
Store in session history
    ↓
ScoringService.add_score()  ← Track for timeline
```

### After Dance Section Completes:

```
Accumulated problem segments
    ↓
FeedbackGenerationService.generate_feedback()
    ↓
Returns 3-5 detailed feedback items
```

### After Entire Session Completes:

```
ScoringService.get_timeline() ────────┐
ScoringService.identify_problem_areas()│
ScoringService.get_session_statistics()├─→ SessionSummaryService.generate_summary()
FeedbackGenerationService (if needed) ─┘        ↓
                                          Final Summary JSON
```

---

## Summary Output Format

```json
{
  "session_id": "abc123",
  "reference_video": "bts_dynamite_chorus",
  "duration": 45.2,

  "statistics": {
    "average_score": 0.78,
    "best_moment": {"timestamp": 23.4, "score": 0.95, "label": "Great form!"},
    "worst_moment": {"timestamp": 12.1, "score": 0.42, "label": "Needs work"},
    "total_frames": 904,
    "problem_segments_count": 3
  },

  "timeline": [
    {"timestamp": 0.0, "score": 0.85, "label": "Great!"},
    {"timestamp": 0.5, "score": 0.82, "label": "Great!"},
    {"timestamp": 1.0, "score": 0.75, "label": "Good"},
    {"timestamp": 1.5, "score": 0.68, "label": "Okay"},
    ...
  ],

  "problem_areas": [
    {
      "start_time": 8.2,
      "end_time": 12.5,
      "title": "Chorus Section Arm Movements",
      "average_score": 0.58,
      "body_parts": ["left_elbow", "right_shoulder"],
      "error_count": 15,
      "feedback": "Your arm extension needs work during the chorus..."
    },
    ...
  ],

  "detailed_feedback": [
    {
      "timestamp": 10.3,
      "title": "Left Elbow Position",
      "feedback": "Your left arm isn't extending fully during the chorus...",
      "severity": "high",
      "body_parts": ["left_elbow"]
    },
    ...
  ],

  "overall_assessment": "Great job on your first attempt! You nailed the footwork and timing. Focus on extending your arms fully during the chorus section.",

  "improvement_suggestions": [
    "Practice arm extensions in front of a mirror",
    "Slow down the chorus section and focus on form",
    "Try the move again - you're almost there!"
  ]
}
```

---

## Why `feedback_generation.py` Doesn't Need Changes

The existing `FeedbackGenerationService` is already perfectly designed for its purpose:

1. **Input Format Compatible**: It accepts `problem_segments` - which can come from:
   - Real-time accumulated errors (during session)
   - Post-session analysis (from ScoringService)

2. **Output Format Stable**: Returns detailed feedback items that fit into the summary

3. **Separation of Concerns**: It doesn't need to know about:
   - How snapshots are collected (that's LiveFeedbackService)
   - How timelines are generated (that's ScoringService)
   - How summaries are assembled (that's SessionSummaryService)

It just does one thing well: **Convert technical error data → human-readable feedback**

---

## Implementation Priority

For the feedback interface focus:

1. ✅ **DONE**: `live_feedback_service.py` - Core streaming feedback
2. ⚠️ **NEEDS WORK**: `scoring.py` - Implement timeline and statistics methods
3. ❌ **TO CREATE**: `session_summary_service.py` - Coordinate final summary

The `feedback_generation.py` service remains unchanged and will be called by the session summary service when needed.

---

## Key Architectural Decisions

1. **Three Services, Three Purposes**:
   - **Live Feedback**: Real-time coaching (0.5s intervals)
   - **Section Feedback**: Detailed analysis (after sections)
   - **Session Summary**: Comprehensive report (after session)

2. **Service Independence**:
   - Each service is self-contained
   - Can be tested independently
   - Can be swapped/improved without affecting others

3. **Internal Services Only**:
   - These are NOT exposed to the API layer
   - API routes will call these services as needed
   - OpenAI integration stays internal to backend

4. **Stateful vs Stateless**:
   - Live Feedback: Stateful (tracks context)
   - Section Feedback: Stateless (processes segments)
   - Session Summary: Stateless (aggregates data)
