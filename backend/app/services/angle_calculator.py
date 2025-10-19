"""
Angle Calculator Service
Preprocesses key dance angles from pose landmarks for LLM analysis
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
import math

class AngleCalculator:
    """Calculates key dance angles from pose landmarks"""
    
    def __init__(self):
        # Key landmark indices for angle calculations
        self.landmark_indices = {
            # Pose landmarks (simplified for dance - only essential points)
            'head_center': 0,  # Nose (simplified head tracking)
            'left_shoulder': 11, 'right_shoulder': 12,
            'left_elbow': 13, 'right_elbow': 14,
            'left_wrist': 15, 'right_wrist': 16,
            'left_pinky': 17, 'right_pinky': 18,
            'left_index': 19, 'right_index': 20,
            'left_thumb': 21, 'right_thumb': 22,
            'left_hip': 23, 'right_hip': 24,
            'left_knee': 25, 'right_knee': 26,
            'left_ankle': 27, 'right_ankle': 28,
            'left_heel': 29, 'right_heel': 30,
            'left_foot_index': 31, 'right_foot_index': 32
        }
    
    def calculate_angle(self, point1: Tuple[float, float], 
                       vertex: Tuple[float, float], 
                       point2: Tuple[float, float]) -> float:
        """Calculate angle between three points in degrees"""
        try:
            # Convert to numpy arrays for easier calculation
            p1 = np.array(point1)
            v = np.array(vertex)
            p2 = np.array(point2)
            
            # Calculate vectors
            v1 = p1 - v
            v2 = p2 - v
            
            # Calculate angle using dot product
            cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
            
            # Clamp to avoid numerical errors
            cos_angle = np.clip(cos_angle, -1.0, 1.0)
            
            # Convert to degrees
            angle = np.degrees(np.arccos(cos_angle))
            
            return float(angle)
        except Exception as e:
            print(f"Error calculating angle: {e}")
            return 0.0
    
    def calculate_arm_angles(self, landmarks: np.ndarray) -> Dict[str, float]:
        """Calculate arm-related angles"""
        angles = {}

        try:
            # Validate landmarks array has enough elements
            min_required = max(self.landmark_indices['left_wrist'],
                             self.landmark_indices['right_wrist']) * 3 + 2
            if len(landmarks) < min_required:
                raise ValueError(f"Landmarks array too short: {len(landmarks)} < {min_required}")

            # Left elbow bend angle (shoulder-elbow-wrist)
            left_shoulder = (landmarks[self.landmark_indices['left_shoulder'] * 3],
                           landmarks[self.landmark_indices['left_shoulder'] * 3 + 1])
            left_elbow = (landmarks[self.landmark_indices['left_elbow'] * 3],
                         landmarks[self.landmark_indices['left_elbow'] * 3 + 1])
            left_wrist = (landmarks[self.landmark_indices['left_wrist'] * 3],
                         landmarks[self.landmark_indices['left_wrist'] * 3 + 1])

            angles['left_elbow_bend'] = self.calculate_angle(left_shoulder, left_elbow, left_wrist)

            # Right elbow bend angle (shoulder-elbow-wrist)
            right_shoulder = (landmarks[self.landmark_indices['right_shoulder'] * 3],
                            landmarks[self.landmark_indices['right_shoulder'] * 3 + 1])
            right_elbow = (landmarks[self.landmark_indices['right_elbow'] * 3],
                          landmarks[self.landmark_indices['right_elbow'] * 3 + 1])
            right_wrist = (landmarks[self.landmark_indices['right_wrist'] * 3],
                          landmarks[self.landmark_indices['right_wrist'] * 3 + 1])

            angles['right_elbow_bend'] = self.calculate_angle(right_shoulder, right_elbow, right_wrist)

        except Exception as e:
            print(f"Error calculating arm angles: {e}")
            angles = {'left_elbow_bend': 0.0, 'right_elbow_bend': 0.0}

        return angles
    
    def calculate_body_angles(self, landmarks: np.ndarray) -> Dict[str, float]:
        """Calculate body posture angles"""
        angles = {}
        
        try:
            # Shoulder alignment
            left_shoulder = (landmarks[self.landmark_indices['left_shoulder'] * 3],
                           landmarks[self.landmark_indices['left_shoulder'] * 3 + 1])
            right_shoulder = (landmarks[self.landmark_indices['right_shoulder'] * 3],
                            landmarks[self.landmark_indices['right_shoulder'] * 3 + 1])
            
            # Calculate shoulder tilt
            shoulder_diff = left_shoulder[1] - right_shoulder[1]
            angles['shoulder_tilt'] = float(np.degrees(np.arctan2(shoulder_diff, 1.0)))
            
            # Hip alignment
            left_hip = (landmarks[self.landmark_indices['left_hip'] * 3],
                       landmarks[self.landmark_indices['left_hip'] * 3 + 1])
            right_hip = (landmarks[self.landmark_indices['right_hip'] * 3],
                        landmarks[self.landmark_indices['right_hip'] * 3 + 1])
            
            # Calculate hip tilt
            hip_diff = left_hip[1] - right_hip[1]
            angles['hip_tilt'] = float(np.degrees(np.arctan2(hip_diff, 1.0)))
            
            # Body lean (shoulder to hip)
            shoulder_center = ((left_shoulder[0] + right_shoulder[0]) / 2,
                             (left_shoulder[1] + right_shoulder[1]) / 2)
            hip_center = ((left_hip[0] + right_hip[0]) / 2,
                         (left_hip[1] + right_hip[1]) / 2)
            
            # Calculate body lean angle
            body_vector = (hip_center[0] - shoulder_center[0], 
                          hip_center[1] - shoulder_center[1])
            angles['body_lean'] = float(np.degrees(np.arctan2(body_vector[0], body_vector[1])))
            
        except Exception as e:
            print(f"Error calculating body angles: {e}")
            angles = {'shoulder_tilt': 0.0, 'hip_tilt': 0.0, 'body_lean': 0.0}
        
        return angles
    
    def calculate_leg_angles(self, landmarks: np.ndarray) -> Dict[str, float]:
        """Calculate leg-related angles"""
        angles = {}

        try:
            # Validate landmarks array
            min_required = max(self.landmark_indices['left_ankle'],
                             self.landmark_indices['right_ankle']) * 3 + 2
            if len(landmarks) < min_required:
                raise ValueError(f"Landmarks array too short: {len(landmarks)} < {min_required}")

            # Left knee bend angle (hip-knee-ankle)
            left_hip = (landmarks[self.landmark_indices['left_hip'] * 3],
                       landmarks[self.landmark_indices['left_hip'] * 3 + 1])
            left_knee = (landmarks[self.landmark_indices['left_knee'] * 3],
                        landmarks[self.landmark_indices['left_knee'] * 3 + 1])
            left_ankle = (landmarks[self.landmark_indices['left_ankle'] * 3],
                         landmarks[self.landmark_indices['left_ankle'] * 3 + 1])

            angles['left_knee_bend'] = self.calculate_angle(left_hip, left_knee, left_ankle)

            # Right knee bend angle (hip-knee-ankle)
            right_hip = (landmarks[self.landmark_indices['right_hip'] * 3],
                        landmarks[self.landmark_indices['right_hip'] * 3 + 1])
            right_knee = (landmarks[self.landmark_indices['right_knee'] * 3],
                         landmarks[self.landmark_indices['right_knee'] * 3 + 1])
            right_ankle = (landmarks[self.landmark_indices['right_ankle'] * 3],
                          landmarks[self.landmark_indices['right_ankle'] * 3 + 1])

            angles['right_knee_bend'] = self.calculate_angle(right_hip, right_knee, right_ankle)

        except Exception as e:
            print(f"Error calculating leg angles: {e}")
            angles = {'left_knee_bend': 0.0, 'right_knee_bend': 0.0}

        return angles
    
    def calculate_hand_angles(self, hand_landmarks: np.ndarray) -> Dict[str, float]:
        """Calculate hand gesture angles"""
        angles = {}
        
        try:
            if len(hand_landmarks) < 21 * 3:  # Need 21 landmarks * 3 coordinates
                return angles
            
            # Hand orientation (palm direction)
            # Use wrist, middle finger base, and middle finger tip
            wrist = (hand_landmarks[0], hand_landmarks[1])
            middle_base = (hand_landmarks[9 * 3], hand_landmarks[9 * 3 + 1])
            middle_tip = (hand_landmarks[12 * 3], hand_landmarks[12 * 3 + 1])
            
            # Calculate hand orientation angle
            hand_vector = (middle_tip[0] - middle_base[0], middle_tip[1] - middle_base[1])
            angles['hand_orientation'] = float(np.degrees(np.arctan2(hand_vector[1], hand_vector[0])))
            
            # Finger extension angles (simplified)
            # Thumb
            thumb_tip = (hand_landmarks[4 * 3], hand_landmarks[4 * 3 + 1])
            thumb_base = (hand_landmarks[2 * 3], hand_landmarks[2 * 3 + 1])
            angles['thumb_extension'] = self.calculate_angle(wrist, thumb_base, thumb_tip)
            
            # Index finger
            index_tip = (hand_landmarks[8 * 3], hand_landmarks[8 * 3 + 1])
            index_base = (hand_landmarks[5 * 3], hand_landmarks[5 * 3 + 1])
            angles['index_extension'] = self.calculate_angle(wrist, index_base, index_tip)
            
        except Exception as e:
            print(f"Error calculating hand angles: {e}")
            angles = {'hand_orientation': 0.0, 'thumb_extension': 0.0, 'index_extension': 0.0}
        
        return angles
    
    def calculate_all_angles(self, pose_landmarks: np.ndarray, 
                           hand_landmarks: Optional[np.ndarray] = None) -> Dict[str, float]:
        """Calculate all key dance angles"""
        all_angles = {}
        
        # Calculate pose angles
        all_angles.update(self.calculate_arm_angles(pose_landmarks))
        all_angles.update(self.calculate_body_angles(pose_landmarks))
        all_angles.update(self.calculate_leg_angles(pose_landmarks))
        
        # Calculate hand angles if provided
        if hand_landmarks is not None:
            all_angles.update(self.calculate_hand_angles(hand_landmarks))
        
        return all_angles
    
    def get_angle_summary(self, angles: Dict[str, float]) -> str:
        """Generate a human-readable summary of key angles"""
        summary = []

        # Elbow angles
        if 'left_elbow_bend' in angles and 'right_elbow_bend' in angles:
            summary.append(f"Elbows: L{angles['left_elbow_bend']:.1f}° R{angles['right_elbow_bend']:.1f}°")

        # Body posture
        if 'shoulder_tilt' in angles and 'hip_tilt' in angles:
            summary.append(f"Posture: Shoulder{angles['shoulder_tilt']:.1f}° Hip{angles['hip_tilt']:.1f}°")

        # Knee angles
        if 'left_knee_bend' in angles and 'right_knee_bend' in angles:
            summary.append(f"Knees: L{angles['left_knee_bend']:.1f}° R{angles['right_knee_bend']:.1f}°")

        return " | ".join(summary)
    
    def extract_key_landmarks(self, landmarks_flat: np.ndarray) -> Dict[str, Dict[str, List[float]]]:
        """Extract key landmark positions for LLM feedback."""
        key_landmarks = {
            'torso': {},
            'arms': {},
            'legs': {},
            'head': {}
        }
        
        # Helper function to get coordinates from flattened landmarks
        def get_coords(landmarks_flat, index):
            start_idx = index * 3
            end_idx = start_idx + 3
            if end_idx <= len(landmarks_flat):
                return landmarks_flat[start_idx:end_idx].tolist()
            return None
        
        # Extract specific landmarks by index
        key_landmarks['torso']['left_shoulder'] = get_coords(landmarks_flat, self.landmark_indices["left_shoulder"])
        key_landmarks['torso']['right_shoulder'] = get_coords(landmarks_flat, self.landmark_indices["right_shoulder"])
        key_landmarks['torso']['left_hip'] = get_coords(landmarks_flat, self.landmark_indices["left_hip"])
        key_landmarks['torso']['right_hip'] = get_coords(landmarks_flat, self.landmark_indices["right_hip"])
        
        key_landmarks['arms']['left_elbow'] = get_coords(landmarks_flat, self.landmark_indices["left_elbow"])
        key_landmarks['arms']['right_elbow'] = get_coords(landmarks_flat, self.landmark_indices["right_elbow"])
        key_landmarks['arms']['left_wrist'] = get_coords(landmarks_flat, self.landmark_indices["left_wrist"])
        key_landmarks['arms']['right_wrist'] = get_coords(landmarks_flat, self.landmark_indices["right_wrist"])
        
        key_landmarks['legs']['left_knee'] = get_coords(landmarks_flat, self.landmark_indices["left_knee"])
        key_landmarks['legs']['right_knee'] = get_coords(landmarks_flat, self.landmark_indices["right_knee"])
        key_landmarks['legs']['left_ankle'] = get_coords(landmarks_flat, self.landmark_indices["left_ankle"])
        key_landmarks['legs']['right_ankle'] = get_coords(landmarks_flat, self.landmark_indices["right_ankle"])
        
        key_landmarks['head']['head_center'] = get_coords(landmarks_flat, self.landmark_indices["head_center"])
        
        # Filter out None values
        filtered_landmarks = {}
        for category, landmarks in key_landmarks.items():
            filtered_landmarks[category] = {k: v for k, v in landmarks.items() if v is not None}
        
        return filtered_landmarks

# Example usage
if __name__ == "__main__":
    calculator = AngleCalculator()
    
    # Test with dummy data
    dummy_pose = np.random.random(33 * 3)  # 33 landmarks * 3 coordinates
    dummy_hand = np.random.random(21 * 3)  # 21 hand landmarks * 3 coordinates
    
    angles = calculator.calculate_all_angles(dummy_pose, dummy_hand)
    print("Calculated angles:", angles)
    print("Summary:", calculator.get_angle_summary(angles))
