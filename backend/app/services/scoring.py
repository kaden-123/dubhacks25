"""
Scoring Service

Tracks and analyzes performance scores throughout a dance session.
Generates timeline data and identifies problem areas for session summaries.

This service is stateful - maintains session data during active dancing.
"""
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
import numpy as np


@dataclass
class ScoreRecord:
    """Single score record at a point in time."""
    timestamp: float  # Seconds since session start
    combined_score: float  # 0.0-1.0
    pose_score: float  # 0.0-1.0
    motion_score: float  # 0.0-1.0
    errors: List[Dict[str, Any]] = field(default_factory=list)


class ScoringService:
    """
    Service for tracking performance scores and generating session analytics.

    Responsibilities:
    - Record scores from each snapshot (every 0.5s)
    - Generate timeline data for visualization
    - Identify problem areas (low-scoring segments)
    - Calculate session statistics

    Usage:
    1. Create service at session start
    2. Call add_score() for each snapshot processed
    3. Call get_timeline(), identify_problem_areas(), get_session_statistics() at session end
    4. Call reset() to clear for new session
    """

    def __init__(self):
        """Initialize scoring service."""
        self.score_records: List[ScoreRecord] = []
        self.session_start_time: Optional[float] = None

    def add_score(
        self,
        timestamp: float,
        combined_score: float,
        pose_score: float = 0.0,
        motion_score: float = 0.0,
        errors: Optional[List[Dict[str, Any]]] = None
    ):
        """
        Record a score for the timeline.

        Args:
            timestamp: Seconds since session start
            combined_score: Overall similarity score (0.0-1.0)
            pose_score: Pose similarity component (0.0-1.0)
            motion_score: Motion similarity component (0.0-1.0)
            errors: List of detected errors at this moment
        """
        if self.session_start_time is None:
            self.session_start_time = timestamp

        record = ScoreRecord(
            timestamp=timestamp,
            combined_score=combined_score,
            pose_score=pose_score,
            motion_score=motion_score,
            errors=errors or []
        )
        self.score_records.append(record)

    def get_timeline(self, resolution: str = "0.5s") -> List[Dict[str, Any]]:
        """
        Get timeline of performance scores.

        Args:
            resolution: Time resolution ("0.5s", "1s", "raw")
                - "0.5s": One data point every 0.5 seconds (default)
                - "1s": Aggregate to 1-second intervals
                - "raw": All recorded data points

        Returns:
            List of timeline points:
            [
                {
                    "timestamp": 0.0,
                    "score": 0.85,
                    "label": "Great!"  # "Great!", "Good", "Okay", "Needs Work"
                },
                ...
            ]
        """
        if not self.score_records:
            return []

        # For now, implement "raw" - can add aggregation later
        timeline = []
        for record in self.score_records:
            timeline.append({
                "timestamp": record.timestamp,
                "score": record.combined_score,
                "label": self._score_to_label(record.combined_score)
            })

        return timeline

    def identify_problem_areas(
        self,
        threshold: float = 0.65,
        min_duration: float = 1.0
    ) -> List[Dict[str, Any]]:
        """
        Identify continuous segments where performance was below threshold.

        Args:
            threshold: Score threshold (default 0.65 = 65%)
            min_duration: Minimum segment duration in seconds (default 1.0s)

        Returns:
            List of problem segments:
            [
                {
                    "start_time": 8.2,
                    "end_time": 12.5,
                    "average_score": 0.58,
                    "body_parts": ["left_elbow", "right_knee"],
                    "error_count": 15,
                    "duration": 4.3
                },
                ...
            ]
        """
        if not self.score_records:
            return []

        problem_segments = []
        current_segment = None

        for record in self.score_records:
            if record.combined_score < threshold:
                # In a problem area
                if current_segment is None:
                    # Start new segment
                    current_segment = {
                        "start_time": record.timestamp,
                        "end_time": record.timestamp,
                        "scores": [record.combined_score],
                        "body_parts_set": set(),
                        "error_count": len(record.errors)
                    }
                else:
                    # Continue segment
                    current_segment["end_time"] = record.timestamp
                    current_segment["scores"].append(record.combined_score)
                    current_segment["error_count"] += len(record.errors)

                # Collect body parts from errors
                for error in record.errors:
                    body_part = error.get("body_part")
                    if body_part:
                        current_segment["body_parts_set"].add(body_part)
            else:
                # Not in problem area
                if current_segment is not None:
                    # End current segment
                    duration = current_segment["end_time"] - current_segment["start_time"]
                    if duration >= min_duration:
                        problem_segments.append({
                            "start_time": current_segment["start_time"],
                            "end_time": current_segment["end_time"],
                            "duration": duration,
                            "average_score": np.mean(current_segment["scores"]),
                            "body_parts": list(current_segment["body_parts_set"]),
                            "error_count": current_segment["error_count"]
                        })
                    current_segment = None

        # Handle case where session ends in a problem area
        if current_segment is not None:
            duration = current_segment["end_time"] - current_segment["start_time"]
            if duration >= min_duration:
                problem_segments.append({
                    "start_time": current_segment["start_time"],
                    "end_time": current_segment["end_time"],
                    "duration": duration,
                    "average_score": np.mean(current_segment["scores"]),
                    "body_parts": list(current_segment["body_parts_set"]),
                    "error_count": current_segment["error_count"]
                })

        return problem_segments

    def get_session_statistics(self) -> Dict[str, Any]:
        """
        Get comprehensive session statistics.

        Returns:
            {
                "total_duration": 45.2,
                "average_score": 0.78,
                "best_moment": {"timestamp": 23.4, "score": 0.95},
                "worst_moment": {"timestamp": 12.1, "score": 0.42},
                "total_frames": 904,
                "problem_segments_count": 3,
                "score_distribution": {
                    "excellent": 25,  # score >= 0.85
                    "good": 40,       # 0.70 <= score < 0.85
                    "okay": 20,       # 0.55 <= score < 0.70
                    "needs_work": 15  # score < 0.55
                }
            }
        """
        if not self.score_records:
            return {
                "total_duration": 0.0,
                "average_score": 0.0,
                "best_moment": None,
                "worst_moment": None,
                "total_frames": 0,
                "problem_segments_count": 0,
                "score_distribution": {
                    "excellent": 0,
                    "good": 0,
                    "okay": 0,
                    "needs_work": 0
                }
            }

        # Calculate duration
        first_timestamp = self.score_records[0].timestamp
        last_timestamp = self.score_records[-1].timestamp
        total_duration = last_timestamp - first_timestamp

        # Calculate average score
        scores = [record.combined_score for record in self.score_records]
        average_score = np.mean(scores)

        # Find best and worst moments
        best_idx = np.argmax(scores)
        worst_idx = np.argmin(scores)

        best_moment = {
            "timestamp": self.score_records[best_idx].timestamp,
            "score": self.score_records[best_idx].combined_score
        }

        worst_moment = {
            "timestamp": self.score_records[worst_idx].timestamp,
            "score": self.score_records[worst_idx].combined_score
        }

        # Calculate score distribution
        distribution = {
            "excellent": 0,  # >= 0.85
            "good": 0,       # 0.70 - 0.85
            "okay": 0,       # 0.55 - 0.70
            "needs_work": 0  # < 0.55
        }

        for score in scores:
            if score >= 0.85:
                distribution["excellent"] += 1
            elif score >= 0.70:
                distribution["good"] += 1
            elif score >= 0.55:
                distribution["okay"] += 1
            else:
                distribution["needs_work"] += 1

        # Count problem segments
        problem_segments = self.identify_problem_areas()

        return {
            "total_duration": total_duration,
            "average_score": average_score,
            "best_moment": best_moment,
            "worst_moment": worst_moment,
            "total_frames": len(self.score_records),
            "problem_segments_count": len(problem_segments),
            "score_distribution": distribution
        }

    def reset(self):
        """Clear session data for new session."""
        self.score_records = []
        self.session_start_time = None

    def _score_to_label(self, score: float) -> str:
        """Convert score to human-readable label."""
        if score >= 0.85:
            return "Great!"
        elif score >= 0.70:
            return "Good"
        elif score >= 0.55:
            return "Okay"
        else:
            return "Needs Work"


# Factory function to get service instance
def get_scoring_service() -> ScoringService:
    """
    Get or create the scoring service.

    Returns:
        ScoringService instance
    """
    return ScoringService()
