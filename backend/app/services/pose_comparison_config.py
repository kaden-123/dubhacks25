"""
Configuration for pose comparison service
"""

from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class PoseComparisonConfig:
    """Configuration for pose comparison"""
    
    # Weights for scoring
    pose_weight: float = 0.7
    motion_weight: float = 0.3
    
    # DTW settings
    dtw_enabled: bool = True
    dtw_window: int = 50
    dtw_interval: float = 2.0
    
    # Smoothing settings
    smoothing_window: int = 5
    
    # Detection thresholds
    min_detection_confidence: float = 0.5
    min_tracking_confidence: float = 0.5
    
    # Performance settings
    max_sequence_length: int = 100
    
    # LLM feedback thresholds
    angle_difference_threshold: float = 5.0  # Only mention angles if difference > 5°
    position_difference_threshold: float = 0.05  # Only mention positions if difference > 0.05
    min_score_threshold: float = 0.8  # Only provide detailed feedback if score < 0.8
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert config to dictionary"""
        return {
            'pose_weight': self.pose_weight,
            'motion_weight': self.motion_weight,
            'dtw_enabled': self.dtw_enabled,
            'dtw_window': self.dtw_window,
            'dtw_interval': self.dtw_interval,
            'smoothing_window': self.smoothing_window,
            'min_detection_confidence': self.min_detection_confidence,
            'min_tracking_confidence': self.min_tracking_confidence,
            'max_sequence_length': self.max_sequence_length,
            'angle_difference_threshold': self.angle_difference_threshold,
            'position_difference_threshold': self.position_difference_threshold,
            'min_score_threshold': self.min_score_threshold
        }
    
    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> 'PoseComparisonConfig':
        """Create config from dictionary"""
        return cls(**config_dict)
    
    def update_weights(self, pose_weight: float, motion_weight: float):
        """Update pose and motion weights"""
        if abs(pose_weight + motion_weight - 1.0) > 0.001:
            raise ValueError("Pose and motion weights must sum to 1.0")
        self.pose_weight = pose_weight
        self.motion_weight = motion_weight
    
    def get_score_breakdown(self, pose_score: float, motion_score: float) -> Dict[str, float]:
        """Calculate weighted score breakdown"""
        combined_score = self.pose_weight * pose_score + self.motion_weight * motion_score
        return {
            'combined_score': combined_score,
            'pose_score': pose_score,
            'motion_score': motion_score,
            'pose_contribution': self.pose_weight * pose_score,
            'motion_contribution': self.motion_weight * motion_score
        }

# Default configurations
DEFAULT_CONFIG = PoseComparisonConfig()

# Preset configurations
DANCE_CONFIG = PoseComparisonConfig(
    pose_weight=0.6,
    motion_weight=0.4,
    dtw_enabled=True,
    smoothing_window=7
)

POSITION_FOCUSED_CONFIG = PoseComparisonConfig(
    pose_weight=0.9,
    motion_weight=0.1,
    dtw_enabled=False
)

MOTION_FOCUSED_CONFIG = PoseComparisonConfig(
    pose_weight=0.3,
    motion_weight=0.7,
    dtw_enabled=True,
    smoothing_window=3
)
