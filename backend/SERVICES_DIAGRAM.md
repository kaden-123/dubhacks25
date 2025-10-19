# Services Architecture Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │   Webcam     │  │ Live Feedback│  │   Session    │                 │
│  │   Capture    │  │   Display    │  │   Summary    │                 │
│  └──────┬───────┘  └──────▲───────┘  └──────▲───────┘                 │
│         │                  │                  │                          │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          │ Snapshot         │ Feedback         │ Summary
          │ (0.5s)          │ Response         │ Response
          │                  │                  │
┌─────────▼──────────────────┼──────────────────┼──────────────────────────┐
│                        API LAYER                                         │
│  ┌─────────────────────┐  │                  │                          │
│  │ WebSocket Handler   │  │                  │                          │
│  │ /ws/session/{id}    │  │                  │                          │
│  └──────┬──────────────┘  │                  │                          │
│         │                  │                  │                          │
│  ┌──────▼────────────────┐│   ┌─────────────▼──────────────┐          │
│  │ Snapshot Processor    ││   │ GET /sessions/{id}/summary │          │
│  │ (API endpoint)        ││   │ (API endpoint)              │          │
│  └──────┬────────────────┘│   └─────────────┬──────────────┘          │
│         │                  │                  │                          │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────┼──────────────────▼──────────────────────────┐
│                     SERVICE LAYER (Internal)                             │
│                                                                           │
│  ┌───────────────────────────────────────────────────────┐              │
│  │           Session State Management                     │              │
│  │  sessions = {                                         │              │
│  │    "session_123": {                                   │              │
│  │      live_feedback_service: LiveFeedbackService(),   │              │
│  │      scoring_service: ScoringService(),              │              │
│  │      pose_comparison_service: PoseComparisonService()│              │
│  │    }                                                  │              │
│  │  }                                                    │              │
│  └───────────────────────────────────────────────────────┘              │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                     │
│  │ PoseComparisonService│  │   ScoringService     │                     │
│  ├──────────────────────┤  ├──────────────────────┤                     │
│  │ • Extract poses      │  │ • add_score()        │                     │
│  │ • Compare with ref   │  │ • get_timeline()     │                     │
│  │ • Calculate scores   │  │ • identify_problems()│                     │
│  │ • Detect errors      │  │ • get_statistics()   │                     │
│  └─────────┬────────────┘  └──────────┬───────────┘                     │
│            │                           │                                  │
│            │ Scores & Errors           │ Records scores                  │
│            ▼                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐               │
│  │          LiveFeedbackService (NEW)                   │               │
│  │  ┌────────────────────────────────────────┐          │               │
│  │  │ Context Management (Stateful)          │          │               │
│  │  │ • recent_snapshots (last 3s)           │          │               │
│  │  │ • recent_feedback (last 2s)            │          │               │
│  │  │ • performance_trend tracking           │          │               │
│  │  │ • persistent_issues detection          │          │               │
│  │  └────────────────────────────────────────┘          │               │
│  │                                                       │               │
│  │  process_snapshot(SnapshotData)                      │               │
│  │         │                                             │               │
│  │         ├─> Should generate feedback?                │               │
│  │         │   (score < 0.65 or errors detected)        │               │
│  │         │                                             │               │
│  │         ├─> Build prompt with context                │               │
│  │         │   (current + trends + persistent issues)   │               │
│  │         │                                             │               │
│  │         ├─> Call OpenAI Vision API ──────────────────┼─┐            │
│  │         │   (frame + prompt)                         │ │            │
│  │         │                                             │ │            │
│  │         └─> Return feedback or None                  │ │            │
│  │                                                       │ │            │
│  └───────────────────────────────────────────────────────┘ │            │
│                                                             │            │
│  ┌──────────────────────────────────────────────────────┐  │            │
│  │    FeedbackGenerationService (EXISTING)              │  │            │
│  │  • Batch processing after sections                   │  │            │
│  │  • Text-based prompts                                │  │            │
│  │  • Generates 3-5 detailed items                      │  │            │
│  │                                                       │  │            │
│  │  generate_feedback(problem_segments)                 │  │            │
│  │         │                                             │  │            │
│  │         └─> Call OpenAI Text API ────────────────────┼──┤            │
│  │             (structured error data)                  │  │            │
│  └──────────────────────────────────────────────────────┘  │            │
│                                                             │            │
│  ┌──────────────────────────────────────────────────────┐  │            │
│  │    SessionSummaryService (TO BE CREATED)             │  │            │
│  │  • Coordinates all services                          │  │            │
│  │  • Generates final summary                           │  │            │
│  │                                                       │  │            │
│  │  generate_summary()                                  │  │            │
│  │         │                                             │  │            │
│  │         ├─> scoring.get_timeline()                   │  │            │
│  │         ├─> scoring.identify_problem_areas()         │  │            │
│  │         ├─> scoring.get_statistics()                 │  │            │
│  │         ├─> feedback.generate_feedback() (optional)  │  │            │
│  │         │                                             │  │            │
│  │         └─> Return complete summary JSON             │  │            │
│  │                                                       │  │            │
│  └───────────────────────────────────────────────────────┘  │            │
│                                                              │            │
└──────────────────────────────────────────────────────────────┼────────────┘
                                                               │
                                                               │
┌──────────────────────────────────────────────────────────────▼────────────┐
│                          EXTERNAL SERVICES                                │
│                                                                           │
│  ┌────────────────────────────────────────────────────────┐             │
│  │                OpenAI API                               │             │
│  │  ┌──────────────────┐      ┌────────────────────┐     │             │
│  │  │ Vision API       │      │ Text API           │     │             │
│  │  │ (GPT-4o-mini)    │      │ (GPT-4o-mini)      │     │             │
│  │  │                  │      │                    │     │             │
│  │  │ • Live feedback  │      │ • Section feedback │     │             │
│  │  │ • Image + text   │      │ • Text only        │     │             │
│  │  │ • < 50 words     │      │ • < 100 words      │     │             │
│  │  └──────────────────┘      └────────────────────┘     │             │
│  │                                                        │             │
│  │  🔒 API Key stored in .env (NEVER exposed)           │             │
│  └────────────────────────────────────────────────────────┘             │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Live Feedback (Every 0.5s)

```
1. Frontend captures frame
   ↓
2. Send via WebSocket:
   {
     "timestamp": 1.5,
     "frame_base64": "...",
     "session_id": "abc123"
   }
   ↓
3. API Handler extracts from WebSocket
   ↓
4. PoseComparisonService.compare():
   {
     "pose_similarity": 0.72,
     "motion_similarity": 0.68,
     "combined_score": 0.71,
     "errors": [
       {"body_part": "left_elbow", "expected_angle": 145, "actual_angle": 95}
     ]
   }
   ↓
5. ScoringService.add_score(1.5, 0.71, errors=[...])
   ↓
6. Create SnapshotData:
   SnapshotData(
     timestamp=1.5,
     frame_base64="...",
     pose_similarity=0.72,
     errors=[...],
     ...
   )
   ↓
7. LiveFeedbackService.process_snapshot(snapshot)
   ↓
8. Check: Should generate? (score 0.71 > 0.65 threshold, but has errors)
   → YES, generate feedback
   ↓
9. Build prompt:
   "Current moment (1.5s):
    Score: 71%
    Trend: stable
    Issues: left_elbow angle off by 50°"
   ↓
10. Call OpenAI Vision API with frame + prompt
    ↓
11. Receive: "Extend your left arm more - straighten that elbow!"
    ↓
12. Return to frontend:
    {
      "timestamp": 1.5,
      "feedback_text": "Extend your left arm more!",
      "severity": "medium",
      "focus_areas": ["left_elbow"]
    }
    ↓
13. Frontend displays feedback banner
```

---

### Example 2: Session Summary (End of session)

```
1. Frontend requests: GET /api/sessions/abc123/summary
   ↓
2. API Handler calls SessionSummaryService.generate_summary()
   ↓
3. Get timeline:
   ScoringService.get_timeline() →
   [
     {"timestamp": 0.0, "score": 0.85, "label": "Great!"},
     {"timestamp": 0.5, "score": 0.82, "label": "Good"},
     ...
   ]
   ↓
4. Identify problem areas:
   ScoringService.identify_problem_areas() →
   [
     {
       "start_time": 8.2,
       "end_time": 12.5,
       "average_score": 0.58,
       "body_parts": ["left_elbow", "right_knee"]
     }
   ]
   ↓
5. Get statistics:
   ScoringService.get_session_statistics() →
   {
     "average_score": 0.78,
     "best_moment": {"timestamp": 23.4, "score": 0.95},
     "worst_moment": {"timestamp": 12.1, "score": 0.42},
     ...
   }
   ↓
6. Generate detailed feedback for problem areas:
   FeedbackGenerationService.generate_feedback(problem_areas) →
   [
     {
       "timestamp": 10.3,
       "title": "Arm Position During Chorus",
       "feedback": "Your left arm isn't extending fully...",
       "severity": "high"
     }
   ]
   ↓
7. Combine everything:
   {
     "statistics": {...},
     "timeline": [...],
     "problem_areas": [...],
     "detailed_feedback": [...]
   }
   ↓
8. Return to frontend
   ↓
9. Frontend displays:
   - Timeline chart
   - Problem area highlights
   - Detailed feedback cards
```

---

## Service Responsibilities Matrix

| Service | Input | Output | State | When Called |
|---------|-------|--------|-------|-------------|
| **PoseComparisonService** | Frame + reference | Scores + errors | Stateful (reference) | Every 0.5s |
| **ScoringService** | Timestamp + score | N/A (records) | Stateful (session) | Every 0.5s |
| **LiveFeedbackService** | SnapshotData | Feedback or None | Stateful (context) | Every 0.5s |
| **FeedbackGenerationService** | Problem segments | Feedback list | Stateless | After section |
| **SessionSummaryService** | N/A (coordinates) | Complete summary | Stateless | End of session |

---

## Why This Design Works

### 1. Clear Boundaries ✅
Each service has a well-defined input/output contract.

### 2. Single Responsibility ✅
Each service does ONE thing:
- PoseComparison → Technical analysis
- Scoring → Data tracking
- LiveFeedback → Real-time coaching
- SectionFeedback → Detailed analysis
- SessionSummary → Coordination

### 3. Testable ✅
```python
# Test LiveFeedbackService in isolation
def test_live_feedback():
    service = LiveFeedbackService()
    snapshot = mock_snapshot(score=0.6)
    result = service.process_snapshot(snapshot)
    assert result["severity"] == "medium"
```

### 4. Flexible ✅
- Want different LLM? Modify feedback services only
- Want different scoring? Modify scoring service only
- Want to add analytics? Create new service

### 5. Secure ✅
- OpenAI API key never leaves backend
- Services are internal
- API layer controls access
