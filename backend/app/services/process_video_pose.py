import cv2
import mediapipe as mp
import json
import pickle
import os
from typing import List, Dict, Any, Union
import numpy as np

class VideoPoseProcessor:
    """
    Service for processing reference videos and extracting pose landmarks.
    Handles video loading, pose detection, normalization, and data storage.
    """
    
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            # Auto-detect the correct path relative to this file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.data_dir = os.path.join(current_dir, "..", "data")
        else:
            self.data_dir = data_dir
        
        self.reference_videos_dir = os.path.join(self.data_dir, "reference_videos")
        self.processed_poses_dir = os.path.join(self.data_dir, "processed_poses")
        
        # Initialize MediaPipe Pose and Hands
        self.mp_pose = mp.solutions.pose
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Create directories if they don't exist
        os.makedirs(self.reference_videos_dir, exist_ok=True)
        os.makedirs(self.processed_poses_dir, exist_ok=True)
    
    def process_video(self, video_filename: str, output_filename: str = None) -> Dict[str, Any]:
        """
        Process a reference video and extract pose landmarks.
        
        Args:
            video_filename: Name of the video file in reference_videos directory
            output_filename: Optional custom name for the output file
            
        Returns:
            Dictionary containing processing results and metadata
        """
        video_path = os.path.join(self.reference_videos_dir, video_filename)
        
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")
        
        # Set output filename (NumPy format)
        if output_filename is None:
            output_filename = os.path.splitext(video_filename)[0] + "_poses.npy"
        
        output_path = os.path.join(self.processed_poses_dir, output_filename)
        
        # Initialize video capture
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        
        print(f"Processing video: {video_filename}")
        print(f"FPS: {fps}, Total frames: {total_frames}, Duration: {duration:.2f}s")
        
        # Initialize pose detection and hand detection
        with self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        ) as pose, self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        ) as hands:
            
            poses_data = []
            frame_count = 0
            
            while cap.isOpened():
                success, frame = cap.read()
                if not success:
                    break
                
                frame_count += 1
                
                # Process every 4th frame for 15 FPS (from 60 FPS video)
                if frame_count % 4 != 0:
                    continue
                
                # Convert BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Process frame for pose landmarks
                pose_results = pose.process(frame_rgb)
                
                # Process frame for hand landmarks (gestures)
                hand_results = hands.process(frame_rgb)
                
                # Calculate timestamp
                timestamp = frame_count / fps
                
                # Extract pose data
                pose_data = {
                    "frame_number": frame_count,
                    "timestamp": timestamp,
                    "landmarks": None,
                    "has_pose": False,
                    "gestures": []
                }
                
                if pose_results.pose_landmarks:
                    # Convert landmarks to numpy arrays for speed
                    landmarks = np.array([[lm.x, lm.y, lm.z, lm.visibility] for lm in pose_results.pose_landmarks.landmark])
                    pose_data["landmarks"] = landmarks
                    pose_data["has_pose"] = True
                
                # Extract gesture data
                if hand_results.multi_hand_landmarks:
                    for idx, hand_landmarks in enumerate(hand_results.multi_hand_landmarks):
                        gesture_info = {
                            "hand_landmarks": np.array([[lm.x, lm.y, lm.z, lm.visibility] for lm in hand_landmarks.landmark]),
                            "handedness": None
                        }
                        
                        # Get hand classification if available
                        if hand_results.multi_handedness and idx < len(hand_results.multi_handedness):
                            handedness = hand_results.multi_handedness[idx].classification[0]
                            gesture_info["handedness"] = {
                                "label": handedness.label,
                                "confidence": handedness.score
                            }
                        
                        # Basic gesture classification (simple finger counting)
                        gesture_info["gesture"] = self._classify_simple_gesture(hand_landmarks.landmark)
                        
                        pose_data["gestures"].append(gesture_info)
                
                poses_data.append(pose_data)
                
                # Progress indicator (every 120 frames = 4 seconds at 30 FPS)
                if frame_count % 120 == 0:
                    progress = (frame_count / total_frames) * 100
                    print(f"Progress: {progress:.1f}% ({frame_count}/{total_frames} frames)")
        
        cap.release()
        
        # Create output data structure
        output_data = {
            "video_info": {
                "filename": video_filename,
                "fps": fps,
                "total_frames": total_frames,
                "duration": duration,
                "resolution": {
                    "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                    "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                }
            },
            "poses": poses_data,
            "processing_info": {
                "total_poses_detected": len([p for p in poses_data if p["landmarks"] is not None]),
                "frames_with_no_pose": len([p for p in poses_data if p["landmarks"] is None])
            }
        }
        
        # Save as NumPy array for maximum speed
        np.save(output_path, poses_data)
        print(f"Saved as NumPy array: {output_path}")
        
        print(f"Processing complete! Saved to: {output_path}")
        print(f"Total poses detected: {output_data['processing_info']['total_poses_detected']}")
        print(f"Frames with no pose: {output_data['processing_info']['frames_with_no_pose']}")
        
        return output_data
    
    def _normalize_pose(self, landmarks: List[Dict]) -> List[Dict]:
        """
        Normalize pose landmarks for comparison.
        Makes poses comparable despite position/scale differences.
        """
        if not landmarks:
            return []
        
        # Convert to numpy arrays for easier calculation
        points = np.array([[lm["x"], lm["y"], lm["z"]] for lm in landmarks])
        
        # Stage 1: Translation (Position Invariance)
        # Use torso center as reference (average of shoulders and hips)
        torso_indices = [11, 12, 23, 24]  # Left/right shoulders and hips
        torso_center = np.mean(points[torso_indices], axis=0)
        points_centered = points - torso_center
        
        # Stage 2: Scale Normalization (Size Invariance)
        # Use torso length as scale reference
        shoulder_center = np.mean(points_centered[[11, 12]], axis=0)
        hip_center = np.mean(points_centered[[23, 24]], axis=0)
        torso_length = np.linalg.norm(shoulder_center - hip_center)
        
        if torso_length > 0:
            points_normalized = points_centered / torso_length
        else:
            points_normalized = points_centered
        
        # Convert back to dictionary format
        normalized_landmarks = []
        for i, landmark in enumerate(landmarks):
            normalized_landmarks.append({
                "x": float(points_normalized[i][0]),
                "y": float(points_normalized[i][1]),
                "z": float(points_normalized[i][2]),
                "visibility": landmark["visibility"]
            })
        
        return normalized_landmarks
    
    def _classify_simple_gesture(self, landmarks) -> str:
        """
        Simple gesture classification based on finger positions.
        Returns a string describing the gesture.
        """
        # Get key landmarks (thumb tip, index tip, middle tip, etc.)
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]
        
        # Get finger base landmarks
        thumb_ip = landmarks[3]
        index_pip = landmarks[6]
        middle_pip = landmarks[10]
        ring_pip = landmarks[14]
        pinky_pip = landmarks[18]
        
        # Check if fingers are extended (tip is above the PIP joint)
        thumb_extended = thumb_tip.y < thumb_ip.y
        index_extended = index_tip.y < index_pip.y
        middle_extended = middle_tip.y < middle_pip.y
        ring_extended = ring_tip.y < ring_pip.y
        pinky_extended = pinky_tip.y < pinky_pip.y
        
        # Count extended fingers
        extended_fingers = sum([index_extended, middle_extended, ring_extended, pinky_extended])
        
        # Basic gesture classification
        if extended_fingers == 0:
            return "closed_fist"
        elif extended_fingers == 1 and index_extended:
            return "pointing"
        elif extended_fingers == 2 and index_extended and middle_extended:
            return "peace_sign"
        elif extended_fingers == 3 and index_extended and middle_extended and ring_extended:
            return "three_fingers"
        elif extended_fingers == 4 and index_extended and middle_extended and ring_extended and pinky_extended:
            return "open_hand"
        elif thumb_extended and not any([index_extended, middle_extended, ring_extended, pinky_extended]):
            return "thumbs_up"
        else:
            return "other_gesture"
    
    
    def load_processed_poses(self, poses_filename: str) -> List[Dict]:
        """
        Load previously processed pose data from NumPy file.
        
        Args:
            poses_filename: Name of the processed poses .npy file
            
        Returns:
            List of pose data dictionaries
        """
        poses_path = os.path.join(self.processed_poses_dir, poses_filename)
        
        if not os.path.exists(poses_path):
            raise FileNotFoundError(f"Processed poses file not found: {poses_path}")
        
        # Load NumPy array
        return np.load(poses_path, allow_pickle=True)
    
    def get_available_videos(self) -> List[str]:
        """Get list of available reference videos."""
        print(f"Looking for videos in: {self.reference_videos_dir}")
        print(f"Directory exists: {os.path.exists(self.reference_videos_dir)}")
        
        if not os.path.exists(self.reference_videos_dir):
            return []
        
        all_files = os.listdir(self.reference_videos_dir)
        print(f"All files in directory: {all_files}")
        
        video_files = []
        for file in all_files:
            if file.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                video_files.append(file)
        
        print(f"Video files found: {video_files}")
        return video_files
    
    def get_available_processed_poses(self) -> List[str]:
        """Get list of available processed pose files."""
        if not os.path.exists(self.processed_poses_dir):
            return []
        
        npy_files = []
        for file in os.listdir(self.processed_poses_dir):
            if file.endswith('.npy'):
                npy_files.append(file)
        
        return npy_files


# Example usage
if __name__ == "__main__":
    # Initialize the processor
    processor = VideoPoseProcessor()
    
    # List available videos
    videos = processor.get_available_videos()
    print("Available videos:", videos)
    
    # Process a video
    if videos:
        video_file = videos[0]
        
        print(f"\n=== Processing {video_file} at 15 FPS with gesture recognition ===")
        result = processor.process_video(video_file)
        
        print(f"Processed {video_file} successfully!")
        
        # Test loading speed
        import time
        
        print("\n=== Loading Speed Test ===")
        
        # Test numpy loading
        start = time.time()
        numpy_data = processor.load_processed_poses(f"{os.path.splitext(video_file)[0]}_poses.npy")
        numpy_time = time.time() - start
        
        print(f"NumPy load time: {numpy_time:.4f}s")
        print(f"Loaded {len(numpy_data)} pose frames")
        
        # Show sample gesture data
        gestures_found = sum(1 for pose in numpy_data if pose.get('gestures'))
        print(f"Frames with gestures: {gestures_found}")
        
        if gestures_found > 0:
            sample_gesture = next(pose['gestures'][0] for pose in numpy_data if pose.get('gestures'))
            print(f"Sample gesture: {sample_gesture.get('gesture', 'unknown')}")
