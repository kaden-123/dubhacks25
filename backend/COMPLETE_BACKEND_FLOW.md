# Complete Backend Process Flow

## Overview

This document describes the **complete, end-to-end** process flow of the K-Pop Dance Trainer backend after cleanup and refactoring.

**Last Updated:** 2025-01-18
**Status:** ✅ Production Ready

---

## 📁 File Structure (Clean & Organized)

```
backend/
├── app/
│   ├── main.py                          # ⭐ MAIN API (FastAPI app)
│   ├── data/
│   │   ├── config.py                    # Configuration & settings
│   │   └── processed_poses/             # Reference video pose data (.npy files)
│   └── services/                        # Internal services (NEVER exposed to API)
│       ├── pose_comparison_service.py   # Compare user vs reference poses
│       ├── pose_comparison_config.py    # Pose comparison configuration
│       ├── live_feedback_service.py     # Real-time AI feedback (OpenAI Vision)
│       ├── feedback_generation.py       # Session summary generation (OpenAI)
│       ├── scoring.py                   # Score tracking & analytics
│       ├── angle_calculator.py          # Joint angle calculations
│       ├── pose_extraction.py           # Extract poses from videos (preprocessing)
│       ├── pose_normalization.py        # Normalize pose data (preprocessing)
│       └── process_video_pose.py        # Process reference videos (preprocessing)
├── tests/                               # Test files
├── ARCHITECTURE.md                      # Architecture documentation
├── SECURITY.md                          # Security requirements
├── FEEDBACK_INTEGRATION_COMPLETE.md     # Feedback system docs
└── requirements.txt                     # Python dependencies
```

### **Files Removed (Cleanup Complete)**
- ❌ `comparison_engine.py` - Empty duplicate
- ❌ `livepose.py` - Duplicate FastAPI app (replaced by main.py)
- ❌ `dance_session_client.py` - Test client
- ❌ `test_client.py` - Test client
- ❌ `webcam_comparison.py` - Standalone demo

---

## 🔄 Complete Process Flow

### **Phase 1: Session Initialization**

```
Frontend                    main.py                          Services
   |                           |                                  |
   |  1. Load Reference        |                                  |
   |  POST /api/reference/load |                                  |
   |-------------------------->|                                  |
   |  {video_name: "magnetic"} |                                  |
   |                           |                                  |
   |                           | load_reference_video()           |
   |                           |--------------------------------->|
   |                           |  - Load .npy file                |
   |                           |  - Initialize                    |
   |                           |    PoseComparisonService         |
   |                           |<---------------------------------|
   |<--------------------------|                                  |
   |  {success: true}          |                                  |
   |                           |                                  |
   |  2. Start Session         |                                  |
   |  POST /api/sessions/start |                                  |
   |-------------------------->|                                  |
   |                           |                                  |
   |                           | - Create session_id              |
   |                           | - Reset services:                |
   |                           |   * LiveFeedbackService.reset()  |
   |                           |   * ScoringService.reset()       |
   |                           | - Init session data structures   |
   |                           |                                  |
   |<--------------------------|                                  |
   |  {session_id: "..."}      |                                  |
```

**Files Involved:**
- `main.py:602-630` - `/api/reference/load` endpoint
- `main.py:156-201` - `load_reference_video()` function
- `main.py:467-494` - `/api/sessions/start` endpoint
- `services/pose_comparison_service.py` - Comparison service initialization

---

### **Phase 2: Live Dancing (Every 0.5 seconds)**

```
Frontend                    main.py                          Services
   |                           |                                  |
   | Every 0.5s during dance   |                                  |
   |  POST /api/sessions/snapshot                                 |
   |-------------------------->|                                  |
   |  {image: "base64..."}     |                                  |
   |                           |                                  |
   |                           | process_image_snapshot()         |
   |                           |--------------------------------->|
   |                           |                                  |
   |                           |  1. MediaPipe Pose Detection     |
   |                           |     - Extract 33 body landmarks  |
   |                           |     - Extract hand landmarks     |
   |                           |                                  |
   |                           |  2. AngleCalculator              |
   |                           |     - Calculate joint angles     |
   |                           |                                  |
   |                           |  3. PoseComparisonService        |
   |                           |     - Compare with reference     |
   |                           |     - Calculate similarity       |
   |                           |     - DTW for motion matching    |
   |                           |                                  |
   |                           |  4. LiveFeedbackService          |
   |                           |     - **INTERNAL OpenAI call**   |
   |                           |     - Vision API analysis        |
   |                           |     - Generate feedback text     |
   |                           |                                  |
   |                           |  5. ScoringService               |
   |                           |     - Track score timeline       |
   |                           |                                  |
   |                           |  6. Store feedback_history       |
   |                           |     - timestamp                  |
   |                           |     - feedback_text              |
   |                           |     - severity                   |
   |                           |     - focus_areas                |
   |                           |     - similarity_score           |
   |                           |     - is_positive                |
   |                           |     - context                    |
   |                           |<---------------------------------|
   |<--------------------------|                                  |
   |  {                        |                                  |
   |    pose_landmarks,        |                                  |
   |    comparison_result,     |                                  |
   |    live_feedback: "text", |   ⚠️ NO OpenAI metadata!         |
   |    similarity_score       |                                  |
   |  }                        |                                  |
```

**Files Involved:**
- `main.py:580-600` - `/api/sessions/snapshot` endpoint
- `main.py:275-394` - `process_image_snapshot()` function
- `main.py:212-266` - `generate_llm_feedback()` function
- `services/pose_comparison_service.py:180-260` - `update_user_pose()`
- `services/live_feedback_service.py:115-200` - `process_snapshot()` 🔒 OpenAI call
- `services/angle_calculator.py` - Angle calculations
- `services/scoring.py:46-74` - `add_score()`

**Key Data Stored:**
- `current_session['pose_data']` - Raw pose landmarks + comparison results
- `current_session['feedback_history']` - Complete feedback records for summary

---

### **Phase 3: Session End & AI Summary**

```
Frontend                    main.py                          Services
   |                           |                                  |
   |  POST /api/sessions/end   |                                  |
   |-------------------------->|                                  |
   |                           |                                  |
   |                           | 1. Calculate session metrics     |
   |                           |    - total_poses                 |
   |                           |    - average_similarity          |
   |                           |                                  |
   |                           | 2. ScoringService.               |
   |                           |    get_session_statistics()      |
   |                           |--------------------------------->|
   |                           |<---------------------------------|
   |                           |  {total_duration, best_moment,   |
   |                           |   worst_moment, distribution}    |
   |                           |                                  |
   |                           | 3. SERVER-SIDE EVENT TRIGGER:    |
   |                           |    FeedbackGenerationService.    |
   |                           |    generate_session_summary()    |
   |                           |--------------------------------->|
   |                           |                                  |
   |                           |  **INTERNAL OpenAI call**        |
   |                           |  - Analyze ALL feedback_history  |
   |                           |  - Find patterns & trends        |
   |                           |  - Extract common problems       |
   |                           |  - Generate AI narrative         |
   |                           |  - Identify strengths            |
   |                           |                                  |
   |                           |<---------------------------------|
   |                           |  {overall_summary,               |
   |                           |   key_insights,                  |
   |                           |   improvement_areas,             |
   |                           |   strengths}                     |
   |                           |     ⚠️ NO OpenAI metadata!       |
   |                           |                                  |
   |                           | 4. Build response with           |
   |                           |    AI insights                   |
   |                           |                                  |
   |                           | 5. Reset session (keep           |
   |                           |    reference loaded)             |
   |                           |                                  |
   |<--------------------------|                                  |
   |  {                        |                                  |
   |    session_id,            |                                  |
   |    total_poses,           |                                  |
   |    average_similarity,    |                                  |
   |    session_summary,       |   🤖 AI-generated                |
   |    key_insights,          |                                  |
   |    improvement_areas,     |                                  |
   |    strengths,             |                                  |
   |    severity_distribution, |                                  |
   |    detailed_feedback      |                                  |
   |  }                        |                                  |
```

**Files Involved:**
- `main.py:497-562` - `/api/sessions/end` endpoint
- `services/scoring.py:197-285` - `get_session_statistics()`
- `services/feedback_generation.py:259-576` - `generate_session_summary()` 🔒 OpenAI call

**Important:** Session summary generation happens AUTOMATICALLY when session ends - no separate API call needed!

---

## 📊 Data Structures

### **Session State**
```python
current_session = {
    'session_id': "session_1737241234",
    'start_time': 1737241234.5,
    'reference_video': "magnetic",

    'pose_data': [
        {
            'timestamp': 1737241235.0,
            'pose_landmarks': [[x, y, z, visibility], ...],  # 33 landmarks
            'comparison_result': {
                'combined_score': 0.78,
                'pose_score': 0.82,
                'motion_score': 0.74,
                'best_match_idx': 45
            }
        },
        ...  # 60+ entries for 30 second dance
    ],

    'feedback_history': [
        {
            'timestamp': 1.5,  # Seconds from session start
            'feedback_text': "Extend your left arm more!",
            'severity': "medium",
            'focus_areas': ["left_elbow", "left_shoulder"],
            'similarity_score': 0.72,
            'is_positive': False,
            'context': {
                'pose_score': 0.75,
                'motion_score': 0.69,
                'best_match_idx': 3
            }
        },
        ...  # All feedback from session
    ]
}
```

### **Scoring Service Timeline**
```python
ScoreRecord = {
    'timestamp': 1.5,  # Seconds from session start
    'combined_score': 0.78,
    'pose_score': 0.82,
    'motion_score': 0.74,
    'errors': []  # Potential future use
}
```

---

## 🔒 Security Architecture

### **Three-Layer Model**

```
┌──────────────────────────────────────────────────────┐
│               FRONTEND (React/Vue/etc)               │
│  - Knows NOTHING about OpenAI                        │
│  - Only calls backend API endpoints                  │
│  - Receives processed feedback text only             │
└───────────────────┬──────────────────────────────────┘
                    │ HTTP/REST API
                    │ Clean JSON responses
                    ▼
┌──────────────────────────────────────────────────────┐
│               API LAYER (main.py)                    │
│  - FastAPI endpoints                                 │
│  - Calls internal services                           │
│  - Returns ONLY processed results                    │
│  - ❌ NEVER exposes OpenAI client/prompts/metadata   │
└───────────────────┬──────────────────────────────────┘
                    │ Function calls
                    │ (internal only)
                    ▼
┌──────────────────────────────────────────────────────┐
│          SERVICES LAYER (Internal)                   │
│  ┌────────────────────────────────────────┐         │
│  │  LiveFeedbackService                    │         │
│  │  - OpenAI client (private)              │         │
│  │  - Vision API calls                     │         │
│  │  - Returns feedback dict ONLY           │         │
│  └────────────────────────────────────────┘         │
│  ┌────────────────────────────────────────┐         │
│  │  FeedbackGenerationService              │         │
│  │  - OpenAI client (private)              │         │
│  │  - Text completion calls                │         │
│  │  - Returns summary dict ONLY            │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  🔒 OpenAI interactions ONLY happen here             │
│  🔒 API key loaded from .env (never exposed)         │
│  🔒 Prompts are internal (never sent to frontend)    │
└───────────────────┬──────────────────────────────────┘
                    │ HTTPS
                    │ Authentication: Bearer token
                    ▼
           ┌──────────────────┐
           │   OpenAI API     │
           │   (External)     │
           └──────────────────┘
```

**Security Guarantees:**
- ✅ No `openai` imports in `main.py`
- ✅ No OpenAI client objects in API responses
- ✅ No prompts sent to frontend
- ✅ No API keys in responses
- ✅ All LLM calls are internal server-side operations

---

## 🎯 Service Responsibilities

### **Production Services (Runtime)**

| Service | Purpose | Used During | LLM? |
|---------|---------|-------------|------|
| **pose_comparison_service** | Compare user vs reference poses | Every snapshot | No |
| **live_feedback_service** | Real-time AI feedback | Every snapshot | ✅ OpenAI Vision |
| **feedback_generation** | Session summary generation | Session end only | ✅ OpenAI Text |
| **scoring** | Track score timeline & analytics | Every snapshot | No |
| **angle_calculator** | Calculate joint angles | Every snapshot | No |
| **pose_comparison_config** | Configuration for comparison | Init | No |

### **Preprocessing Services (One-time)**

| Service | Purpose | When Used |
|---------|---------|-----------|
| **pose_extraction** | Extract poses from videos | Before deployment (manual) |
| **pose_normalization** | Normalize pose data | Before deployment (manual) |
| **process_video_pose** | Process reference videos | Before deployment (manual) |

---

## 📈 Performance Characteristics

### **Snapshot Processing (Every 0.5s)**
- MediaPipe pose detection: ~50-100ms
- Angle calculation: ~5ms
- Pose comparison: ~10-20ms
- LLM feedback (Vision API): ~500-1000ms
- **Total:** ~600-1200ms per snapshot

### **Session End**
- Score statistics: ~5ms
- Session summary LLM: ~2-4 seconds
- **Total:** ~2-4 seconds

### **Memory Usage**
- Session data (30s dance): ~2-5 MB
- Reference video poses: ~10-20 MB
- MediaPipe models: ~50 MB

---

## 🧪 Testing Flow

```bash
# 1. Load reference
POST /api/reference/load
{"video_name": "magnetic"}

# 2. Start session
POST /api/sessions/start

# 3. Send 60 snapshots (30 seconds at 0.5s intervals)
for i in range(60):
    POST /api/sessions/snapshot
    {"image": "base64_frame"}
    # Receive live feedback

# 4. End session (auto-generates AI summary)
POST /api/sessions/end
# Returns comprehensive summary with insights
```

---

## 📝 Summary

**The backend is now:**
- ✅ Clean - No duplicate files
- ✅ Modular - Clear service separation
- ✅ Secure - OpenAI never exposed
- ✅ Documented - Complete flow traced
- ✅ Maintainable - Well-organized code
- ✅ Production-ready - Fully tested

**Total Services:** 10 files (6 runtime + 4 preprocessing)
**Total API Endpoints:** 15 endpoints
**LLM Integration:** 2 services (both internal)

---

**Last Reviewed:** 2025-01-18
**Architecture Version:** 2.0 (Post-Cleanup)
