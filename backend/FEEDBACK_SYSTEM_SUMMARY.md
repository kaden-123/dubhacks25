# Feedback System Architecture Summary

## Why We Created `live_feedback_service.py`

### The Problem
Your original requirement: Generate live feedback every 0.5 seconds using LLM with video snapshots.

### Why Not Use Existing `feedback_generation.py`?

The existing service is designed for **batch processing**:

| Aspect | `feedback_generation.py` (Existing) | `live_feedback_service.py` (New) |
|--------|-------------------------------------|-----------------------------------|
| **Timing** | After section completes | Every 0.5 seconds during dance |
| **Input** | Historical segments (3-5+ seconds) | Single snapshot (current moment) |
| **State** | Stateless (no memory) | Stateful (rolling context window) |
| **Output** | 3-5 detailed items | 1 focused item or None |
| **LLM API** | Text-only prompts | Vision API (image + text) |
| **Context** | None (analyzes segment in isolation) | Tracks trends, avoids repetition |
| **Purpose** | Comprehensive analysis | Immediate coaching |

**Analogy**:
- `feedback_generation.py` = **Teacher grading your test paper after you finish**
- `live_feedback_service.py` = **Coach shouting corrections while you're running**

### Architectural Principle: Single Responsibility

Each service does **one thing well**:

```
Live Feedback Service ────→ Real-time coaching during performance
                            (Streaming, stateful, immediate)

Section Feedback Service ──→ Detailed analysis after sections
                            (Batch, stateless, comprehensive)

Session Summary Service ───→ Overall report with timeline
                            (Aggregation, statistics, visualization)
```

Combining them would create a **bloated, confusing** service trying to serve two different purposes.

---

## Complete System Architecture

### 1. During Active Dancing (Every 0.5 seconds)

```
┌─────────────────┐
│ Video Snapshot  │ (frame captured every 0.5s)
│ + Pose Data     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ PoseComparisonService           │
│ - Extract pose landmarks        │
│ - Compare with reference        │
│ - Calculate similarity scores   │
│ - Detect specific errors        │
└────────┬────────────────────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│ LiveFeedbackService     │    │ ScoringService           │
│ - Maintain context      │    │ - Record scores          │
│ - Track trends          │    │ - Build timeline         │
│ - Generate feedback     │    │ - Track problem areas    │
│ - Use Vision API        │    └──────────────────────────┘
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Return to Frontend:     │
│ {                       │
│   "feedback_text": "...",│
│   "severity": "medium", │
│   "focus_areas": [...]  │
│ }                       │
└─────────────────────────┘
```

### 2. After Dance Section Completes

```
┌──────────────────────────┐
│ Accumulated Data         │
│ - All snapshots          │
│ - All comparison results │
│ - Problem segments       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ FeedbackGenerationService    │
│ (Existing - unchanged)       │
│ - Analyze problem segments   │
│ - Generate 3-5 detailed      │
│   feedback items             │
│ - Text-based LLM prompts     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Return to Frontend:          │
│ [                            │
│   {                          │
│     "title": "...",          │
│     "feedback": "...",       │
│     "severity": "medium",    │
│     "body_parts": [...]      │
│   },                         │
│   ...                        │
│ ]                            │
└──────────────────────────────┘
```

### 3. After Entire Session Completes

```
┌──────────────────────┐
│ ScoringService       │
│ - get_timeline()     │
│ - identify_problem() │
│ - get_statistics()   │
└─────────┬────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ SessionSummaryService (New)     │
│ - Aggregate all data            │
│ - Generate timeline chart data  │
│ - Identify problem areas        │
│ - Call FeedbackService if needed│
│ - Optional: LLM summary         │
└─────────┬───────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│ Complete Summary:                │
│ {                                │
│   "statistics": {...},           │
│   "timeline": [...],             │
│   "problem_areas": [...],        │
│   "detailed_feedback": [...],    │
│   "overall_assessment": "..."    │
│ }                                │
└──────────────────────────────────┘
```

---

## Files Involved in Feedback System

### ✅ Implemented
1. **`live_feedback_service.py`** (NEW)
   - Real-time feedback generation
   - Vision API integration
   - Context tracking
   - Location: `backend/app/services/live_feedback_service.py`

2. **`feedback_generation.py`** (EXISTING - NO CHANGES)
   - Post-section feedback
   - Text-based LLM prompts
   - Batch processing
   - Location: `backend/app/services/feedback_generation.py`

3. **`pose_comparison_service.py`** (EXISTING)
   - Generates similarity scores
   - Detects errors
   - Already functional
   - Location: `backend/app/services/pose_comparison_service.py`

### ⚠️ Needs Implementation
4. **`scoring.py`** (EXISTS BUT EMPTY)
   - Timeline generation
   - Statistics calculation
   - Problem area identification
   - Location: `backend/app/services/scoring.py`

### ❌ To Be Created
5. **`session_summary_service.py`** (DOESN'T EXIST)
   - Coordinate all services
   - Generate final summary
   - Location: `backend/app/services/session_summary_service.py`

---

## Does `feedback_generation.py` Need Changes?

### Answer: **NO**

**Why?** The existing service is perfectly designed for its purpose.

**What it does**:
```python
def generate_feedback(problem_segments: List[Dict], max_items: int = None) -> List[Dict]:
    # Takes problem segments (from anywhere)
    # Returns detailed feedback items
```

**Where problem_segments come from** (doesn't matter to the service):
- Could be from real-time accumulated errors
- Could be from post-session analysis
- Could be from ScoringService
- Service doesn't care - it just converts errors → feedback

**Separation of Concerns**:
- ✅ It focuses on ONE job: LLM-based feedback generation
- ✅ It doesn't manage state
- ✅ It doesn't track timelines
- ✅ It doesn't coordinate services
- ✅ It just transforms data: `technical errors → human feedback`

**This is good architecture!** Keep it as is.

---

## OpenAI API Security Note

### ✅ Correct: OpenAI is INTERNAL to Backend

Both feedback services are **internal backend services**:

```
Frontend ─── API Layer ─── LiveFeedbackService ─── OpenAI API
                                                    (Internal)

Frontend ─── API Layer ─── FeedbackGenerationService ─── OpenAI API
                                                          (Internal)
```

**Frontend never sees**:
- OpenAI API key
- OpenAI client
- LLM prompts
- Raw LLM responses

**Frontend only receives**:
- Processed feedback objects
- Via backend API endpoints

This is exactly what you wanted: **OpenAI stays internal to backend**.

---

## Next Steps (If You Want to Implement)

### For Live Feedback (DONE):
1. ✅ Created `live_feedback_service.py`
2. ✅ Defined data models (`SnapshotData`, `FeedbackContext`)
3. ✅ Implemented streaming interface
4. ⚠️ TODO: Create API endpoint that calls this service
5. ⚠️ TODO: Integrate with WebSocket for 0.5s interval

### For Session Summary (PENDING):
1. ❌ Implement `scoring.py` methods:
   - `get_timeline()`
   - `identify_problem_areas()`
   - `get_session_statistics()`

2. ❌ Create `session_summary_service.py`:
   - Coordinate scoring + feedback services
   - Generate final summary JSON

3. ❌ Create API endpoint for summary:
   - `GET /api/sessions/{session_id}/summary`

---

## Summary

**You now have**:
1. ✅ **Live feedback interface** - Ready for 0.5s snapshot processing
2. ✅ **Clear architecture** - Three services, three purposes
3. ✅ **Separation of concerns** - Each service focused
4. ✅ **OpenAI stays internal** - Never exposed to frontend
5. ✅ **Documentation** - Architecture clearly explained

**The design is complete.** The implementation of API endpoints and integration with your WebSocket flow is the next step, but the **feedback generation interface** is ready to use.
