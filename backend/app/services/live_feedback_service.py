"""
Live Feedback Generation Service

Generates real-time dance feedback at 0.5-second intervals during active dancing.
This service is designed for streaming feedback, processing snapshots of the current
dance state and providing immediate, contextual guidance.

Architecture Overview:
- Receives snapshot data every 0.5 seconds (2 Hz)
- Maintains rolling context window of recent analysis
- Generates focused, actionable feedback using OpenAI Vision API
- Manages rate limiting and context optimization
- Internal backend service - NOT exposed to API directly

Key Differences from FeedbackGenerationService:
- Streaming vs Batch: Processes continuous snapshots, not post-dance segments
- Real-time vs Historical: Focuses on current moment + recent context
- Single vs Multiple: Generates 1 feedback item per call, not 3-5
- Visual Input: Uses video frame snapshots, not just pose data
"""
from typing import List, Dict, Any, Optional, Deque
from collections import deque
from dataclasses import dataclass, field
import time
import base64
import numpy as np
from openai import OpenAI
from app.data.config import settings


@dataclass
class SnapshotData:
    """
    Snapshot of dance state at a single point in time.

    This encapsulates all data available at a 0.5s interval:
    - Video frame for visual analysis
    - Pose comparison metrics
    - Timing information
    """
    timestamp: float  # Seconds since dance started
    frame_base64: str  # Base64-encoded JPEG snapshot

    # Pose comparison results
    pose_similarity: float  # 0.0-1.0
    motion_similarity: float  # 0.0-1.0
    combined_score: float  # 0.0-1.0

    # Specific errors detected (optional - from comparison engine)
    errors: List[Dict[str, Any]] = field(default_factory=list)
    # Example error: {"body_part": "left_elbow", "expected_angle": 145, "actual_angle": 95, "difference": 50}

    # Reference matching
    best_match_idx: int = 0  # Index of best matching reference frame
    reference_timestamp: float = 0.0  # Expected timestamp in reference video
    timing_offset: float = 0.0  # User ahead/behind reference (seconds)


@dataclass
class FeedbackContext:
    """
    Rolling context window for generating informed feedback.

    Maintains recent history to understand trends and avoid repetition.
    """
    recent_snapshots: Deque[SnapshotData] = field(default_factory=lambda: deque(maxlen=6))  # Last 3 seconds
    recent_feedback: Deque[Dict[str, Any]] = field(default_factory=lambda: deque(maxlen=4))  # Last 2 seconds

    # Trend tracking
    performance_trend: str = "stable"  # "improving", "degrading", "stable"
    persistent_issues: List[str] = field(default_factory=list)  # Body parts with consistent errors

    def add_snapshot(self, snapshot: SnapshotData):
        """Add new snapshot and update trends."""
        self.recent_snapshots.append(snapshot)
        self._update_trends()

    def add_feedback(self, feedback: Dict[str, Any]):
        """Record generated feedback to avoid repetition."""
        self.recent_feedback.append(feedback)

    def _update_trends(self):
        """Analyze recent snapshots to detect performance trends."""
        if len(self.recent_snapshots) < 3:
            self.performance_trend = "stable"
            return

        # Get scores from recent snapshots
        scores = [s.combined_score for s in self.recent_snapshots]

        # Simple trend detection: compare first half vs second half
        mid = len(scores) // 2
        first_half_avg = np.mean(scores[:mid]) if mid > 0 else 0
        second_half_avg = np.mean(scores[mid:])

        diff = second_half_avg - first_half_avg

        if diff > 0.1:
            self.performance_trend = "improving"
        elif diff < -0.1:
            self.performance_trend = "degrading"
        else:
            self.performance_trend = "stable"

        # Track persistent issues
        error_counts = {}
        for snapshot in self.recent_snapshots:
            for error in snapshot.errors:
                body_part = error.get("body_part", "unknown")
                error_counts[body_part] = error_counts.get(body_part, 0) + 1

        # Issues appearing in 50%+ of recent snapshots are "persistent"
        threshold = len(self.recent_snapshots) * 0.5
        self.persistent_issues = [
            part for part, count in error_counts.items()
            if count >= threshold
        ]

    def get_summary(self) -> Dict[str, Any]:
        """Get summary of current context for prompt building."""
        if not self.recent_snapshots:
            return {
                "average_score": 0.0,
                "trend": "stable",
                "persistent_issues": [],
                "recent_feedback_count": 0
            }

        return {
            "average_score": np.mean([s.combined_score for s in self.recent_snapshots]),
            "trend": self.performance_trend,
            "persistent_issues": self.persistent_issues,
            "recent_feedback_count": len(self.recent_feedback),
            "timing_offset": self.recent_snapshots[-1].timing_offset if self.recent_snapshots else 0.0
        }


class LiveFeedbackService:
    """
    Service for generating real-time dance feedback during active dancing.

    This service processes streaming snapshot data and generates contextual
    feedback using OpenAI's Vision API (GPT-4o-mini with image input).

    Design Principles:
    1. Stateful: Maintains rolling context window
    2. Focused: Generates single, actionable feedback per call
    3. Adaptive: Considers trends and avoids repetition
    4. Optimized: Manages rate limits and token usage for 2 Hz cadence

    Usage Flow:
    1. Initialize service at dance start
    2. Call process_snapshot() every 0.5 seconds
    3. Receive immediate feedback or None (if no significant issues)
    4. Call reset() when dance ends or new section starts
    """

    def __init__(self):
        """Initialize the live feedback service."""
        # OpenAI client
        if not settings.openai_api_key:
            raise ValueError(
                "OpenAI API key not found. Please set OPENAI_API_KEY in your .env file"
            )

        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"  # Supports vision input

        # Feedback generation settings
        self.max_tokens = 100  # Keep responses brief for real-time
        self.temperature = 0.7
        self.min_score_for_feedback = 0.65  # Only generate feedback if score below this

        # Context management
        self.context = FeedbackContext()

        # Rate limiting
        self.last_llm_call_time = 0
        self.min_llm_interval = 0.5  # Minimum 0.5s between LLM calls (matches snapshot rate)
        self.llm_timeout = 3.0  # Timeout for LLM calls (must be < 0.5s ideally, but allow buffer)

        # Statistics
        self.total_snapshots_processed = 0
        self.total_feedback_generated = 0
        self.total_llm_calls = 0
        self.total_llm_errors = 0

    def process_snapshot(
        self,
        snapshot: SnapshotData,
        force_feedback: bool = False
    ) -> Optional[Dict[str, Any]]:
        """
        Process a snapshot and generate feedback if needed.

        Args:
            snapshot: Current dance state snapshot
            force_feedback: If True, generate feedback regardless of score

        Returns:
            Feedback dictionary if generated, None if no feedback needed:
            {
                "timestamp": float,
                "feedback_text": str,
                "severity": str,  # "high", "medium", "low"
                "focus_areas": List[str],  # Body parts to focus on
                "is_positive": bool,  # True if encouragement, False if correction
                "context": Dict[str, Any]  # Additional context
            }
        """
        self.total_snapshots_processed += 1

        # Add snapshot to context
        self.context.add_snapshot(snapshot)

        # Determine if feedback is needed
        should_generate = (
            force_feedback or
            snapshot.combined_score < self.min_score_for_feedback or
            len(snapshot.errors) > 0
        )

        if not should_generate:
            return None

        # Check rate limiting
        current_time = time.time()
        time_since_last_call = current_time - self.last_llm_call_time

        if time_since_last_call < self.min_llm_interval:
            # Too soon, skip this snapshot (or queue for next interval)
            return None

        # Generate feedback
        try:
            feedback = self._generate_live_feedback(snapshot)
            self.last_llm_call_time = current_time
            self.total_llm_calls += 1
            self.total_feedback_generated += 1

            # Add to context
            self.context.add_feedback(feedback)

            return feedback

        except Exception as e:
            self.total_llm_errors += 1
            print(f"Live feedback generation failed: {e}")

            # Return fallback feedback
            return self._generate_fallback_feedback(snapshot)

    def _generate_live_feedback(self, snapshot: SnapshotData) -> Dict[str, Any]:
        """
        Generate feedback using OpenAI Chat API with pose data.

        chats with pose data instead of images for efficiency.
        """
        # Build prompt with context and pose data
        prompt = self._build_live_prompt_with_pose_data(snapshot)

        # Call OpenAI Chat API (no vision needed)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a real-time K-pop dance coach providing instant feedback. "
                        "Be concise, specific, and encouraging. Focus on ONE immediate correction "
                        "or encouragement. Keep responses under 50 words."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=100,
            temperature=0.7
        )

        feedback_text = response.choices[0].message.content.strip()

        # Determine severity and focus areas
        severity = self._calculate_severity(snapshot)
        focus_areas = [error.get("body_part", "posture") for error in snapshot.errors[:2]]

        # Detect if feedback is positive (encouragement) or corrective
        is_positive = snapshot.combined_score > 0.7 or "good" in feedback_text.lower()

        return {
            "timestamp": snapshot.timestamp,
            "feedback_text": feedback_text,
            "severity": severity,
            "focus_areas": focus_areas,
            "is_positive": is_positive,
            "context": self.context.get_summary()
        }

    def _build_live_prompt_with_pose_data(self, snapshot: SnapshotData) -> str:
        """
        Build prompt for live feedback generation.

        Includes current snapshot data + rolling context.
        """
        context_summary = self.context.get_summary()

        prompt = f"""Current dance moment (timestamp: {snapshot.timestamp:.1f}s):

**Performance Score:** {snapshot.combined_score*100:.0f}% match with reference
**Trend:** {context_summary['trend']}
"""

        # Add timing information
        if abs(snapshot.timing_offset) > 0.2:  # More than 0.2s off
            if snapshot.timing_offset > 0:
                prompt += f"**Timing:** You're {snapshot.timing_offset:.1f}s ahead of the reference\n"
            else:
                prompt += f"**Timing:** You're {abs(snapshot.timing_offset):.1f}s behind the reference\n"

        # Add specific errors
        if snapshot.errors:
            prompt += "\n**Current Issues:**\n"
            for i, error in enumerate(snapshot.errors[:2], 1):  # Top 2 errors
                body_part = error.get("body_part", "position")
                difference = error.get("difference", "off")
                prompt += f"{i}. {body_part}: {difference}\n"

        # Add persistent issues if any
        if context_summary['persistent_issues']:
            prompt += f"\n**Persistent Issues:** {', '.join(context_summary['persistent_issues'])}\n"

        prompt += """
Provide ONE specific, actionable correction or encouragement for this moment.
Focus on the most impactful improvement. Be conversational and brief (under 50 words).
"""

        return prompt

    def _generate_fallback_feedback(self, snapshot: SnapshotData) -> Dict[str, Any]:
        """
        Generate simple template-based feedback if LLM fails.

        This ensures the system always returns something useful.
        """
        if snapshot.combined_score >= 0.7:
            feedback_text = "Great job! Keep maintaining that form."
            severity = "low"
            is_positive = True
        elif snapshot.errors:
            # Use the first error
            error = snapshot.errors[0]
            body_part = error.get("body_part", "position")
            feedback_text = f"Adjust your {body_part} to match the reference more closely."
            severity = "medium"
            is_positive = False
        else:
            feedback_text = "Try to match the reference dancer's movements more closely."
            severity = "medium"
            is_positive = False

        focus_areas = [error.get("body_part", "posture") for error in snapshot.errors[:2]]

        return {
            "timestamp": snapshot.timestamp,
            "feedback_text": feedback_text,
            "severity": severity,
            "focus_areas": focus_areas,
            "is_positive": is_positive,
            "context": self.context.get_summary()
        }

    def _calculate_severity(self, snapshot: SnapshotData) -> str:
        """Calculate severity based on score and errors."""
        if snapshot.combined_score < 0.5 or len(snapshot.errors) >= 3:
            return "high"
        elif snapshot.combined_score < 0.7 or len(snapshot.errors) >= 1:
            return "medium"
        else:
            return "low"

    def reset(self):
        """
        Reset the service state for a new dance section or session.

        Call this when:
        - Starting a new dance section
        - User pauses and resumes
        - Switching to a new reference video
        """
        self.context = FeedbackContext()
        self.last_llm_call_time = 0
        # Statistics are preserved across resets for session tracking

    def get_statistics(self) -> Dict[str, Any]:
        """
        Get service statistics for monitoring and debugging.

        Returns:
            Statistics dictionary with usage metrics
        """
        return {
            "total_snapshots_processed": self.total_snapshots_processed,
            "total_feedback_generated": self.total_feedback_generated,
            "total_llm_calls": self.total_llm_calls,
            "total_llm_errors": self.total_llm_errors,
            "feedback_generation_rate": (
                self.total_feedback_generated / self.total_snapshots_processed
                if self.total_snapshots_processed > 0 else 0
            ),
            "llm_error_rate": (
                self.total_llm_errors / self.total_llm_calls
                if self.total_llm_calls > 0 else 0
            ),
            "current_context": self.context.get_summary()
        }


# Factory function to get service instance
def get_live_feedback_service() -> LiveFeedbackService:
    """
    Get or create the live feedback service.

    In production, this could return a singleton instance or
    create per-session instances as needed.

    Returns:
        LiveFeedbackService instance
    """
    return LiveFeedbackService()
