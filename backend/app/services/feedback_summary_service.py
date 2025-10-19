"""
Feedback Summary Service

Generates comprehensive dance feedback summaries when user pauses or video ends.
Analyzes pose data over timeframes and provides clickable feedback with timestamps.

Key Features:
- Analyzes pose data collected during the session
- Identifies patterns and recurring issues
- Provides specific feedback with timestamps
- Groups feedback by timeframes for better organization
- Returns structured data for frontend presentation
"""

from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
import numpy as np
import time
from collections import defaultdict
from app.services.angle_calculator import AngleCalculator


@dataclass
class FeedbackItem:
    """Individual feedback item with timestamp and details."""
    timestamp: float  # Video timestamp where issue occurs
    severity: str  # "high", "medium", "low"
    category: str  # "pose", "motion", "timing", "posture"
    body_part: str  # Specific body part (e.g., "left_elbow", "right_knee")
    feedback_text: str  # Human-readable feedback
    expected_value: Optional[float] = None  # Expected angle/position
    actual_value: Optional[float] = None  # Actual angle/position
    difference: Optional[float] = None  # Difference between expected and actual


@dataclass
class TimeframeFeedback:
    """Feedback for a specific time range."""
    start_time: float
    end_time: float
    timeframe_duration: float
    feedback_items: List[FeedbackItem] = field(default_factory=list)
    overall_score: float = 0.0
    dominant_issues: List[str] = field(default_factory=list)


@dataclass
class FeedbackSummary:
    """Complete feedback summary for the session."""
    session_duration: float
    total_feedback_items: int
    timeframes: List[TimeframeFeedback] = field(default_factory=list)
    overall_session_score: float = 0.0
    most_common_issues: List[Tuple[str, int]] = field(default_factory=list)
    improvement_suggestions: List[str] = field(default_factory=list)


class FeedbackSummaryService:
    """Service for generating comprehensive feedback summaries."""
    
    def __init__(self):
        self.angle_calculator = AngleCalculator()
        # Thresholds for different severity levels - more lenient
        self.severity_thresholds = {
            "high": 0.4,    # < 40% accuracy
            "medium": 0.7,  # 40-70% accuracy
            "low": 1.0      # > 70% accuracy
        }
        # Minimum difference to report as an issue - more lenient
        self.min_angle_difference = 20.0  # degrees
        self.min_position_difference = 0.08  # normalized units
        
    def generate_summary(self, pose_data: List[Dict[str, Any]], reference_service=None) -> FeedbackSummary:
        """
        Generate comprehensive feedback summary from session pose data.
        
        Args:
            pose_data: List of pose data collected during session
            reference_service: PoseComparisonService for reference data
            
        Returns:
            FeedbackSummary with organized feedback by timeframes
        """
        if not pose_data:
            return self._create_empty_summary()
            
        # Group pose data into timeframes (e.g., 10-second chunks)
        timeframes = self._group_into_timeframes(pose_data)
        
        # Analyze each timeframe
        timeframe_feedbacks = []
        all_feedback_items = []
        
        for timeframe_data in timeframes:
            timeframe_feedback = self._analyze_timeframe(timeframe_data, reference_service)
            timeframe_feedbacks.append(timeframe_feedback)
            all_feedback_items.extend(timeframe_feedback.feedback_items)
        
        # Calculate session statistics
        session_duration = pose_data[-1]['timestamp'] - pose_data[0]['timestamp'] if pose_data else 0
        overall_score = np.mean([data['comparison_result'].get('combined_score', 0.0) 
                               for data in pose_data if data['comparison_result']])
        
        # Find most common issues
        issue_counts = defaultdict(int)
        for item in all_feedback_items:
            issue_counts[f"{item.category}:{item.body_part}"] += 1
        
        most_common_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Generate improvement suggestions
        improvement_suggestions = self._generate_improvement_suggestions(most_common_issues)
        
        return FeedbackSummary(
            session_duration=session_duration,
            total_feedback_items=len(all_feedback_items),
            timeframes=timeframe_feedbacks,
            overall_session_score=overall_score,
            most_common_issues=most_common_issues,
            improvement_suggestions=improvement_suggestions
        )
    
    def _group_into_timeframes(self, pose_data: List[Dict[str, Any]], timeframe_duration: float = 10.0) -> List[List[Dict[str, Any]]]:
        """Group pose data into timeframes for analysis."""
        if not pose_data:
            return []
        
        timeframes = []
        current_timeframe = []
        start_time = pose_data[0]['timestamp']
        
        for data in pose_data:
            # Start new timeframe every timeframe_duration seconds
            if data['timestamp'] - start_time >= timeframe_duration and current_timeframe:
                timeframes.append(current_timeframe)
                current_timeframe = []
                start_time = data['timestamp']
            
            current_timeframe.append(data)
        
        # Add the last timeframe
        if current_timeframe:
            timeframes.append(current_timeframe)
        
        return timeframes
    
    def _analyze_timeframe(self, timeframe_data: List[Dict[str, Any]], reference_service=None) -> TimeframeFeedback:
        """Analyze a single timeframe and generate feedback."""
        if not timeframe_data:
            return TimeframeFeedback(0, 0, 0)
        
        start_time = timeframe_data[0]['timestamp']
        end_time = timeframe_data[-1]['timestamp']
        duration = end_time - start_time
        
        feedback_items = []
        scores = []
        issues_by_category = defaultdict(int)
        
        for data in timeframe_data:
            if not data.get('comparison_result') or not data.get('pose_landmarks'):
                continue
            
            comparison_result = data['comparison_result']
            pose_landmarks = data['pose_landmarks']
            preprocessed_angles = data.get('preprocessed_angles', {})
            
            scores.append(comparison_result.get('combined_score', 0.0))
            
            # Get reference data for comparison
            best_match_idx = comparison_result.get('best_match_idx', 0)
            reference_landmarks = None
            reference_angles = {}
            
            if reference_service and best_match_idx is not None:
                reference_landmarks = reference_service.get_reference_pose_at_index(best_match_idx)
                reference_angles = reference_service.get_reference_angles_at_index(best_match_idx)
            
            # Analyze pose differences
            pose_feedback = self._analyze_pose_differences(
                data['timestamp'],
                pose_landmarks,
                preprocessed_angles,
                reference_landmarks,
                reference_angles,
                comparison_result
            )
            
            feedback_items.extend(pose_feedback)
            
            # Count issues by category
            for item in pose_feedback:
                issues_by_category[item.category] += 1
        
        # Calculate timeframe statistics
        overall_score = np.mean(scores) if scores else 0.0
        dominant_issues = sorted(issues_by_category.items(), key=lambda x: x[1], reverse=True)[:3]
        dominant_issues = [category for category, _ in dominant_issues]
        
        return TimeframeFeedback(
            start_time=start_time,
            end_time=end_time,
            timeframe_duration=duration,
            feedback_items=feedback_items,
            overall_score=overall_score,
            dominant_issues=dominant_issues
        )
    
    def _analyze_pose_differences(self, timestamp: float, pose_landmarks: np.ndarray, 
                                user_angles: Dict[str, float], reference_landmarks: Optional[np.ndarray],
                                reference_angles: Dict[str, float], comparison_result: Dict[str, Any]) -> List[FeedbackItem]:
        """Analyze specific pose differences and generate feedback items."""
        feedback_items = []
        
        # Analyze angle differences
        if user_angles and reference_angles:
            angle_feedback = self._analyze_angle_differences(timestamp, user_angles, reference_angles)
            feedback_items.extend(angle_feedback)
        
        # Analyze landmark position differences
        if reference_landmarks is not None:
            position_feedback = self._analyze_position_differences(timestamp, pose_landmarks, reference_landmarks)
            feedback_items.extend(position_feedback)
        
        # Add overall performance feedback
        overall_score = comparison_result.get('combined_score', 0.0)
        if overall_score < 0.5:
            feedback_items.append(FeedbackItem(
                timestamp=timestamp,
                severity="high" if overall_score < 0.3 else "medium",
                category="pose",
                body_part="overall",
                feedback_text=f"Overall pose accuracy is low ({overall_score*100:.0f}%). Focus on matching the reference more closely.",
                expected_value=1.0,
                actual_value=overall_score,
                difference=1.0 - overall_score
            ))
        
        return feedback_items
    
    def _analyze_angle_differences(self, timestamp: float, user_angles: Dict[str, float], 
                                 reference_angles: Dict[str, float]) -> List[FeedbackItem]:
        """Analyze angle differences between user and reference."""
        feedback_items = []
        
        for angle_name, user_angle in user_angles.items():
            if angle_name not in reference_angles:
                continue
                
            ref_angle = reference_angles[angle_name]
            difference = abs(user_angle - ref_angle)
            
            # Only report significant differences
            if difference >= self.min_angle_difference:
                severity = self._calculate_angle_severity(difference)
                body_part = self._get_body_part_from_angle(angle_name)
                
                if user_angle < ref_angle:
                    feedback_text = f"Your {body_part} needs to be more extended. Current: {user_angle:.0f}°, Target: {ref_angle:.0f}°"
                else:
                    feedback_text = f"Your {body_part} is too extended. Current: {user_angle:.0f}°, Target: {ref_angle:.0f}°"
                
                feedback_items.append(FeedbackItem(
                    timestamp=timestamp,
                    severity=severity,
                    category="pose",
                    body_part=body_part,
                    feedback_text=feedback_text,
                    expected_value=ref_angle,
                    actual_value=user_angle,
                    difference=difference
                ))
        
        return feedback_items
    
    def _analyze_position_differences(self, timestamp: float, user_landmarks: np.ndarray, 
                                    reference_landmarks: np.ndarray) -> List[FeedbackItem]:
        """Analyze landmark position differences."""
        feedback_items = []
        
        key_landmarks = {
            'left_shoulder': 11, 'right_shoulder': 12,
            'left_elbow': 13, 'right_elbow': 14,
            'left_wrist': 15, 'right_wrist': 16,
            'left_hip': 23, 'right_hip': 24,
            'left_knee': 25, 'right_knee': 26,
            'left_ankle': 27, 'right_ankle': 28
        }
        
        for landmark_name, idx in key_landmarks.items():
            if idx < len(user_landmarks) and idx < len(reference_landmarks):
                user_pos = user_landmarks[idx][:3]  # x, y, z coordinates
                ref_pos = reference_landmarks[idx][:3]
                distance = np.linalg.norm(user_pos - ref_pos)
                
                if distance >= self.min_position_difference:
                    severity = self._calculate_position_severity(distance)
                    
                    feedback_text = f"Your {landmark_name.replace('_', ' ')} position is off by {distance:.3f} units from the reference"
                    
                    feedback_items.append(FeedbackItem(
                        timestamp=timestamp,
                        severity=severity,
                        category="pose",
                        body_part=landmark_name,
                        feedback_text=feedback_text,
                        expected_value=0.0,
                        actual_value=distance,
                        difference=distance
                    ))
        
        return feedback_items
    
    def _calculate_angle_severity(self, difference: float) -> str:
        """Calculate severity based on angle difference."""
        if difference >= 45:
            return "high"
        elif difference >= 25:
            return "medium"
        else:
            return "low"
    
    def _calculate_position_severity(self, distance: float) -> str:
        """Calculate severity based on position distance."""
        if distance >= 0.15:
            return "high"
        elif distance >= 0.08:
            return "medium"
        else:
            return "low"
    
    def _get_body_part_from_angle(self, angle_name: str) -> str:
        """Convert angle name to human-readable body part."""
        angle_mapping = {
            'left_shoulder_angle': 'left shoulder',
            'right_shoulder_angle': 'right shoulder',
            'left_elbow_angle': 'left elbow',
            'right_elbow_angle': 'right elbow',
            'left_hip_angle': 'left hip',
            'right_hip_angle': 'right hip',
            'left_knee_angle': 'left knee',
            'right_knee_angle': 'right knee',
            'left_ankle_angle': 'left ankle',
            'right_ankle_angle': 'right ankle'
        }
        return angle_mapping.get(angle_name, angle_name.replace('_', ' '))
    
    def _generate_improvement_suggestions(self, most_common_issues: List[Tuple[str, int]]) -> List[str]:
        """Generate improvement suggestions based on common issues."""
        suggestions = []
        
        issue_categories = defaultdict(list)
        for issue, count in most_common_issues:
            category, body_part = issue.split(':', 1)
            issue_categories[category].append(body_part)
        
        if 'pose' in issue_categories:
            body_parts = issue_categories['pose']
            if len(body_parts) >= 3:
                suggestions.append("Focus on overall body alignment and posture. Try practicing in front of a mirror.")
            elif any('elbow' in part for part in body_parts):
                suggestions.append("Pay attention to your arm positioning. Keep elbows at the correct angles.")
            elif any('knee' in part for part in body_parts):
                suggestions.append("Work on your leg positioning and knee alignment.")
        
        if 'motion' in issue_categories:
            suggestions.append("Focus on smoother transitions between movements. Practice the choreography slowly first.")
        
        if not suggestions:
            suggestions.append("Great job! Continue practicing to maintain consistency.")
        
        return suggestions
    
    def _create_empty_summary(self) -> FeedbackSummary:
        """Create an empty summary when no data is available."""
        return FeedbackSummary(
            session_duration=0.0,
            total_feedback_items=0,
            timeframes=[],
            overall_session_score=0.0,
            most_common_issues=[],
            improvement_suggestions=["No pose data available for analysis."]
        )
