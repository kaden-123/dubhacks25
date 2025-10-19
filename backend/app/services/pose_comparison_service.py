import numpy as np
import cv2
import mediapipe as mp
from typing import List, Dict, Any, Tuple, Optional
import math
# DTW is now implemented as a custom algorithm
DTW_AVAILABLE = True
import time
from collections import deque
from .pose_comparison_config import PoseComparisonConfig, DEFAULT_CONFIG

class PoseComparisonService:
    """
    Service for comparing user poses with reference poses using static and dynamic metrics.
    Implements pose similarity, motion analysis, and Dynamic Time Warping for timing alignment.
    """
    
    def __init__(self, reference_poses_data: List[Dict[str, Any]], 
                 config: PoseComparisonConfig = None):
        """
        Initialize pose comparison service.
        
        Args:
            reference_poses_data: List of reference pose data from processed video
            config: Configuration for pose comparison
        """
        self.reference_poses = reference_poses_data
        self.config = config if config is not None else DEFAULT_CONFIG
        
        # Initialize MediaPipe pose detection
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Extract and normalize reference pose landmarks
        self.reference_landmarks = self._extract_reference_landmarks()
        self.reference_motions = self._calculate_reference_motions()
        
        # Initialize user pose tracking
        self.user_pose_history = deque(maxlen=self.config.smoothing_window * 2)
        self.user_motion_history = deque(maxlen=self.config.smoothing_window)
        self.similarity_scores = deque(maxlen=self.config.smoothing_window)
        
        # DTW configuration (optimized for performance)
        self.dtw_window = min(self.config.dtw_window, len(self.reference_landmarks))
        self.last_dtw_time = 0
        self.dtw_interval = self.config.dtw_interval
        self.dtw_enabled = self.config.dtw_enabled
        
    def _extract_reference_landmarks(self) -> List[np.ndarray]:
        """Extract and normalize reference pose landmarks."""
        landmarks_list = []
        
        for pose_data in self.reference_poses:
            if pose_data.get("landmarks") is not None:
                # Extract 3D coordinates (x, y, z) from landmarks
                landmarks = pose_data["landmarks"]
                if landmarks.shape[1] >= 3:  # Ensure we have x, y, z coordinates
                    # Extract only x, y, z coordinates (ignore visibility)
                    coords = landmarks[:, :3].flatten()
                    # Filter to essential landmarks for dance
                    filtered_coords = self._filter_essential_landmarks(coords)
                    landmarks_list.append(filtered_coords)
        
        return landmarks_list
    
    def _calculate_reference_motions(self) -> List[np.ndarray]:
        """Calculate motion vectors for reference poses."""
        motions = []
        
        for i in range(1, len(self.reference_landmarks)):
            # Calculate velocity: v_t = pose_t - pose_(t-1)
            velocity = self.reference_landmarks[i] - self.reference_landmarks[i-1]
            motions.append(velocity)
        
        return motions
    
    def _filter_essential_landmarks(self, landmarks: np.ndarray) -> np.ndarray:
        """Filter landmarks to keep only essential points for dance (remove detailed face tracking)."""
        # Handle both 1D (flattened) and 2D (num_landmarks, 4) input arrays
        if landmarks.ndim == 2:
            landmarks = landmarks.flatten()
        
        # Essential landmarks for dance (indices):
        # 0: nose (head center), 11-32: body and limbs
        essential_indices = [0] + list(range(11, 33))  # Keep nose + body/limbs
        
        # Extract only essential landmarks (3 coordinates each: x, y, z)
        essential_landmarks = []
        for idx in essential_indices:
            start_idx = idx * 3
            end_idx = start_idx + 3
            if end_idx <= len(landmarks):
                essential_landmarks.extend(landmarks[start_idx:end_idx])
        
        return np.array(essential_landmarks)
    
    def _normalize_pose_by_scale(self, landmarks: np.ndarray) -> np.ndarray:
        """Normalize pose landmarks by shoulder width."""
        # Handle empty or None landmarks
        if landmarks is None or len(landmarks) == 0:
            return np.array([])
            
        # Filter to essential landmarks first
        landmarks = self._filter_essential_landmarks(landmarks)
        
        if len(landmarks) < 6:  # Need at least 2 landmarks (6 coordinates)
            return landmarks
        
        # Extract shoulder landmarks (after filtering)
        # Left shoulder: landmark 11, Right shoulder: landmark 12
        # After filtering: [nose, left_shoulder, right_shoulder, ...]
        # Left shoulder: indices 3, 4, 5 (after filtering)
        # Right shoulder: indices 6, 7, 8 (after filtering)
        if len(landmarks) >= 9:  # Ensure we have both shoulders
            left_shoulder = landmarks[3:6]
            right_shoulder = landmarks[6:9]
            
            # Calculate shoulder width
            shoulder_width = np.linalg.norm(left_shoulder - right_shoulder)
            
            if shoulder_width > 0:
                # Normalize by shoulder width
                normalized_landmarks = landmarks / shoulder_width
                return normalized_landmarks
        
        return landmarks
    
    def _calculate_pose_similarity(self, user_landmarks: np.ndarray, 
                                 reference_landmarks: np.ndarray) -> float:
        """Calculate cosine similarity between user and reference poses."""
        # Handle empty or None landmarks
        if user_landmarks is None or len(user_landmarks) == 0:
            return 0.0
        if reference_landmarks is None or len(reference_landmarks) == 0:
            return 0.0
            
        # Normalize both poses
        user_normalized = self._normalize_pose_by_scale(user_landmarks)
        ref_normalized = self._normalize_pose_by_scale(reference_landmarks)
        
        # Ensure same dimensions
        min_length = min(len(user_normalized), len(ref_normalized))
        if min_length == 0:
            return 0.0
            
        user_vec = user_normalized[:min_length]
        ref_vec = ref_normalized[:min_length]
        
        # Calculate cosine similarity
        dot_product = np.dot(user_vec, ref_vec)
        norm_user = np.linalg.norm(user_vec)
        norm_ref = np.linalg.norm(ref_vec)
        
        if norm_user > 0 and norm_ref > 0:
            cosine_similarity = dot_product / (norm_user * norm_ref)
            
            # Make the scoring more sensitive by adding Euclidean distance penalty
            euclidean_distance = np.linalg.norm(user_vec - ref_vec)
            max_possible_distance = np.linalg.norm(user_vec) + np.linalg.norm(ref_vec)
            
            # Combine cosine similarity with Euclidean distance penalty
            # Higher Euclidean distance = lower score
            distance_penalty = 1.0 - (euclidean_distance / max_possible_distance)
            distance_penalty = max(0.0, distance_penalty)
            
            # Weighted combination: 85% cosine similarity, 15% distance penalty (more lenient)
            final_score = 0.85 * cosine_similarity + 0.15 * distance_penalty
            
            # Apply lighter penalty for low cosine similarity
            if cosine_similarity < 0.2:  # Only penalize very low similarity
                final_score *= 0.8  # Even less harsh penalty
            
            return max(0.0, min(1.0, final_score))  # Clamp between 0 and 1
        
        return 0.0
    
    def _calculate_motion_similarity(self, user_motion: np.ndarray, 
                                   reference_motion: np.ndarray) -> float:
        """Calculate similarity between motion vectors."""
        # Flatten arrays to ensure they're 1D
        user_vec = user_motion.flatten() if user_motion.ndim > 1 else user_motion
        ref_vec = reference_motion.flatten() if reference_motion.ndim > 1 else reference_motion
        
        # Ensure same dimensions
        min_length = min(len(user_vec), len(ref_vec))
        user_vec = user_vec[:min_length]
        ref_vec = ref_vec[:min_length]
        
        # Calculate motion similarity with multiple factors
        dot_product = np.dot(user_vec, ref_vec)
        norm_user = np.linalg.norm(user_vec)
        norm_ref = np.linalg.norm(ref_vec)
        
        if norm_user > 0 and norm_ref > 0:
            # Direction similarity (cosine similarity)
            cosine_similarity = dot_product / (norm_user * norm_ref)
            
            # Speed similarity - how similar are the motion magnitudes?
            speed_ratio = min(norm_user, norm_ref) / max(norm_user, norm_ref)
            
            # Euclidean distance penalty for motion vectors
            euclidean_distance = np.linalg.norm(user_vec - ref_vec)
            max_possible_distance = norm_user + norm_ref
            distance_penalty = 1.0 - (euclidean_distance / max_possible_distance)
            distance_penalty = max(0.0, distance_penalty)
            
            # Combine factors: 50% direction, 30% speed, 20% distance
            motion_similarity = (0.5 * cosine_similarity + 
                               0.3 * speed_ratio + 
                               0.2 * distance_penalty)
            
            # Apply much lighter penalties for direction matching - be very forgiving
            if cosine_similarity < 0.1:  # Very different directions
                motion_similarity *= 0.8  # Very light penalty
            elif cosine_similarity < 0.3:  # Moderately different directions
                motion_similarity *= 0.9  # Very light penalty
            
            return max(0.0, min(1.0, motion_similarity))
        
        return 0.0
    
    def _find_best_reference_match(self, user_landmarks: np.ndarray, 
                                 user_motion: Optional[np.ndarray] = None) -> Tuple[int, float, float]:
        """Find the best matching reference pose using combined metrics."""
        best_pose_score = 0.0
        best_motion_score = 0.0
        best_match_idx = 0
        
        # Calculate pose similarity with all reference poses
        pose_scores = []
        for ref_landmarks in self.reference_landmarks:
            pose_score = self._calculate_pose_similarity(user_landmarks, ref_landmarks)
            pose_scores.append(pose_score)
        
        # Find best pose match
        best_pose_idx = np.argmax(pose_scores)
        best_pose_score = pose_scores[best_pose_idx]
        
        # Calculate motion similarity if motion data is available
        if user_motion is not None and len(self.reference_motions) > 0:
            # Find best motion match within a window around the best pose match
            motion_window = 10  # Search within ±10 frames
            start_idx = max(0, best_pose_idx - motion_window)
            end_idx = min(len(self.reference_motions), best_pose_idx + motion_window)
            
            motion_scores = []
            for i in range(start_idx, end_idx):
                motion_score = self._calculate_motion_similarity(user_motion, self.reference_motions[i])
                motion_scores.append(motion_score)
            
            if motion_scores:
                best_motion_score = max(motion_scores)
                # Update best match index based on combined score
                combined_scores = []
                for i in range(start_idx, end_idx):
                    combined_score = (self.config.pose_weight * pose_scores[i] + 
                                    self.config.motion_weight * motion_scores[i - start_idx])
                    combined_scores.append(combined_score)
                
                if combined_scores:
                    best_combined_idx = np.argmax(combined_scores)
                    best_match_idx = start_idx + best_combined_idx
                    best_pose_score = pose_scores[best_match_idx]
        
        return best_match_idx, best_pose_score, best_motion_score
    
    def _apply_dynamic_time_warping(self, user_sequence: List[np.ndarray], 
                                  reference_sequence: List[np.ndarray]) -> Tuple[float, List[Tuple[int, int]]]:
        """
        Apply Dynamic Time Warping to align user and reference sequences.
        Implements the full mathematical DTW algorithm as described in the documentation.
        """
        if not user_sequence or not reference_sequence:
            return 0.0, []
        
        # Limit sequence length for performance
        max_seq_length = min(50, self.dtw_window)
        user_seq = user_sequence[-max_seq_length:] if len(user_sequence) > max_seq_length else user_sequence
        ref_seq = reference_sequence[-max_seq_length:] if len(reference_sequence) > max_seq_length else reference_sequence
        
        # Early exit for very short sequences
        if len(user_seq) < 2 or len(ref_seq) < 2:
            return 0.0, []
        
        try:
            # Convert to numpy arrays and ensure they're 2D
            user_seq_array = np.array([seq.flatten() if isinstance(seq, np.ndarray) else seq for seq in user_seq])
            ref_seq_array = np.array([seq.flatten() if isinstance(seq, np.ndarray) else seq for seq in ref_seq])
            
            # Ensure both sequences have the same number of features
            min_features = min(user_seq_array.shape[1], ref_seq_array.shape[1])
            user_seq_array = user_seq_array[:, :min_features]
            ref_seq_array = ref_seq_array[:, :min_features]
            
        except Exception as e:
            print(f"Error preparing sequences for DTW: {e}")
            return 0.0, []
        
        try:
            N, M = len(user_seq_array), len(ref_seq_array)
            
            # Step 1: Create local distance matrix D (N x M)
            # D[i,j] = d(x_i, y_j) where d is Euclidean distance
            D = np.zeros((N, M))
            for i in range(N):
                for j in range(M):
                    D[i, j] = np.linalg.norm(user_seq_array[i] - ref_seq_array[j])
            
            # Step 2: Create accumulated cost matrix C (N x M)
            # C[i,j] = minimum cumulative distance to align X[1:i] and Y[1:j]
            C = np.full((N, M), np.inf)
            
            # Boundary conditions
            C[0, 0] = D[0, 0]
            
            # Fill first row: C[i,0] = D[i,0] + C[i-1,0]
            for i in range(1, N):
                C[i, 0] = D[i, 0] + C[i-1, 0]
            
            # Fill first column: C[0,j] = D[0,j] + C[0,j-1]
            for j in range(1, M):
                C[0, j] = D[0, j] + C[0, j-1]
            
            # Fill the rest using the recurrence relation:
            # C[i,j] = D[i,j] + min(C[i-1,j], C[i,j-1], C[i-1,j-1])
            for i in range(1, N):
                for j in range(1, M):
                    C[i, j] = D[i, j] + min(
                        C[i-1, j],      # vertical move (insertion in Y)
                        C[i, j-1],      # horizontal move (insertion in X)
                        C[i-1, j-1]     # diagonal move (match)
                    )
            
            # Step 3: DTW distance is the final accumulated cost
            dtw_distance = C[N-1, M-1]
            
            # Step 4: Normalize by path length for better comparison
            # The path length K is approximately max(N, M) for typical alignments
            path_length = max(N, M)
            normalized_dtw_distance = dtw_distance / path_length
            
            # Step 5: Convert distance to similarity score (0.0 to 1.0)
            # Use a sigmoid-like function to convert distance to similarity
            # Higher distance -> lower similarity
            max_expected_distance = 60.0  # Very lenient threshold for maximum timing tolerance
            dtw_score = max(0.0, 1.0 - (normalized_dtw_distance / max_expected_distance))
            
            # Step 6: Optional - Find the warping path (for debugging/visualization)
            warping_path = self._backtrack_warping_path(C, N, M)
            
            print(f"🎯 DTW Debug: distance={dtw_distance:.3f}, normalized={normalized_dtw_distance:.3f}, score={dtw_score:.3f}, path_len={len(warping_path)}")
            
            return dtw_score, warping_path
            
        except Exception as e:
            print(f"DTW calculation failed: {e}")
            import traceback
            traceback.print_exc()
            return 0.0, []
    
    def _backtrack_warping_path(self, C: np.ndarray, N: int, M: int) -> List[Tuple[int, int]]:
        """
        Backtrack to find the optimal warping path from the accumulated cost matrix.
        Returns the path from (N-1, M-1) to (0, 0).
        """
        path = []
        i, j = N - 1, M - 1
        
        # Start from the end and work backwards
        while i > 0 or j > 0:
            path.append((i, j))
            
            # Find the minimum cost neighbor
            if i == 0:
                j -= 1
            elif j == 0:
                i -= 1
            else:
                min_cost = min(C[i-1, j], C[i, j-1], C[i-1, j-1])
                if C[i-1, j-1] == min_cost:
                    i -= 1
                    j -= 1
                elif C[i-1, j] == min_cost:
                    i -= 1
                else:
                    j -= 1
        
        # Add the starting point
        path.append((0, 0))
        
        # Reverse to get the path from start to end
        return list(reversed(path))
    
    def _calculate_pose_distance(self, pose1: np.ndarray, pose2: np.ndarray) -> float:
        """Calculate Euclidean distance between two poses."""
        try:
            vec1 = pose1.flatten()
            vec2 = pose2.flatten()
            
            if len(vec1) != len(vec2):
                return 2.0  # Maximum distance for mismatched dimensions
            
            return np.linalg.norm(vec1 - vec2)
        except:
            return 2.0  # Maximum distance on error
    
    def update_user_pose(self, user_landmarks: np.ndarray, timestamp: float = None) -> Dict[str, Any]:
        """Update user pose and calculate similarity scores."""
        if timestamp is None:
            timestamp = time.time()
        
        print(f"🔄 DEBUG: update_user_pose called with landmarks shape: {user_landmarks.shape if user_landmarks is not None else 'None'}, timestamp: {timestamp}")
        
        # Add to pose history
        self.user_pose_history.append({
            'landmarks': user_landmarks.copy(),
            'timestamp': timestamp
        })
        
        print(f"🔄 DEBUG: Pose history length: {len(self.user_pose_history)}")
        
        # Calculate motion if we have at least 2 poses
        user_motion = None
        if len(self.user_pose_history) >= 2:
            current_pose = self.user_pose_history[-1]['landmarks']
            previous_pose = self.user_pose_history[-2]['landmarks']
            user_motion = current_pose - previous_pose
            self.user_motion_history.append(user_motion)
        
        # Find best reference match
        best_match_idx, pose_score, motion_score = self._find_best_reference_match(
            user_landmarks, user_motion
        )
        
        print(f"🎯 DEBUG: Best match - idx: {best_match_idx}, pose_score: {pose_score:.3f}, motion_score: {motion_score:.3f}")
        
        # Calculate combined score using config weights
        combined_score = (self.config.pose_weight * pose_score + 
                         self.config.motion_weight * motion_score)
        
        print(f"🎯 DEBUG: Combined score: {combined_score:.3f} (weights: pose={self.config.pose_weight}, motion={self.config.motion_weight})")
        
        # Apply DTW if enabled, enough data, and time has passed
        dtw_score = 0.0
        dtw_path = []
        if (self.dtw_enabled and 
            len(self.user_pose_history) >= 10 and 
            timestamp - self.last_dtw_time > self.dtw_interval):
            
            print(f"🔄 DEBUG: Applying DTW - user_seq_len: {len(self.user_pose_history)}, ref_seq_len: {len(self.reference_landmarks)}")
            user_sequence = [pose['landmarks'] for pose in self.user_pose_history]
            ref_sequence = self.reference_landmarks
            
            dtw_score, dtw_path = self._apply_dynamic_time_warping(user_sequence, ref_sequence)
            self.last_dtw_time = timestamp
            print(f"🎯 DEBUG: DTW score: {dtw_score:.3f}, path length: {len(dtw_path)}")
        
        # Add to similarity scores for smoothing
        self.similarity_scores.append({
            'combined_score': combined_score,
            'pose_score': pose_score,
            'motion_score': motion_score,
            'dtw_score': dtw_score,
            'timestamp': timestamp
        })
        
        # Apply smoothing
        smoothed_scores = self._apply_smoothing()
        
        return {
            'combined_score': smoothed_scores['combined_score'],
            'pose_score': smoothed_scores['pose_score'],
            'motion_score': smoothed_scores['motion_score'],
            'dtw_score': smoothed_scores['dtw_score'],
            'best_match_idx': best_match_idx,
            'dtw_path': dtw_path,
            'timestamp': timestamp
        }
    
    def _apply_smoothing(self) -> Dict[str, float]:
        """Apply moving average smoothing to scores."""
        if not self.similarity_scores:
            return {'combined_score': 0.0, 'pose_score': 0.0, 'motion_score': 0.0, 'dtw_score': 0.0}
        
        # Calculate moving averages
        window_size = min(self.config.smoothing_window, len(self.similarity_scores))
        recent_scores = list(self.similarity_scores)[-window_size:]
        
        combined_avg = np.mean([score['combined_score'] for score in recent_scores])
        pose_avg = np.mean([score['pose_score'] for score in recent_scores])
        motion_avg = np.mean([score['motion_score'] for score in recent_scores])
        dtw_avg = np.mean([score['dtw_score'] for score in recent_scores])
        
        return {
            'combined_score': combined_avg,
            'pose_score': pose_avg,
            'motion_score': motion_avg,
            'dtw_score': dtw_avg
        }
    
    def get_reference_pose_at_index(self, index: int) -> Optional[np.ndarray]:
        """Get reference pose landmarks at specific index."""
        if 0 <= index < len(self.reference_landmarks):
            return self.reference_landmarks[index]
        return None
    
    def get_reference_angles_at_index(self, index: int) -> Dict[str, float]:
        """Get reference angles at specific index."""
        if 0 <= index < len(self.reference_landmarks):
            landmarks = self.reference_landmarks[index]
            return self.angle_calculator.calculate_angles(landmarks)
        return {}
    
    def get_reference_motion_at_index(self, index: int) -> Optional[np.ndarray]:
        """Get reference motion at specific index."""
        if 0 <= index < len(self.reference_motions):
            return self.reference_motions[index]
        return None
    
    def get_reference_frame_info(self, index: int) -> Optional[Dict[str, Any]]:
        """Get reference frame information at specific index."""
        if 0 <= index < len(self.reference_poses):
            return self.reference_poses[index]
        return None
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get comparison statistics."""
        if not self.similarity_scores:
            return {'average_score': 0.0, 'total_comparisons': 0}
        
        recent_scores = list(self.similarity_scores)[-10:]  # Last 10 comparisons
        avg_score = np.mean([score['combined_score'] for score in recent_scores])
        
        return {
            'average_score': avg_score,
            'total_comparisons': len(self.similarity_scores),
            'reference_frames': len(self.reference_landmarks),
            'user_pose_history_length': len(self.user_pose_history),
            'dtw_enabled': self.dtw_enabled
        }
    
    def set_dtw_enabled(self, enabled: bool):
        """Enable or disable DTW calculations for performance tuning."""
        self.dtw_enabled = enabled
        if not enabled:
            # Clear DTW-related data when disabled
            self.last_dtw_time = 0
    
    def update_config(self, config: PoseComparisonConfig):
        """Update the configuration dynamically."""
        self.config = config
        # Update internal settings
        self.dtw_window = min(self.config.dtw_window, len(self.reference_landmarks))
        self.dtw_interval = self.config.dtw_interval
        self.dtw_enabled = self.config.dtw_enabled
        
        # Resize deques if needed
        new_maxlen = self.config.smoothing_window
        self.user_pose_history = deque(list(self.user_pose_history), maxlen=new_maxlen * 2)
        self.user_motion_history = deque(list(self.user_motion_history), maxlen=new_maxlen)
        self.similarity_scores = deque(list(self.similarity_scores), maxlen=new_maxlen)


# Example usage and testing
if __name__ == "__main__":
    # This would be used with actual reference pose data
    print("PoseComparisonService initialized. Use with reference pose data from processed videos.")
