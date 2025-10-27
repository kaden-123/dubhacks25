import numpy as np
from dtaidistance import dtw

class PoseCompare:
    def __init__(self,
                pos_tolerance=0,
                vel_tolerance=0,
                accel_tolerance=0):

        # Store tolerances in a dictionary for easier access
        self.tolerances = {
            'position': pos_tolerance,
            'velocity': vel_tolerance,
            'acceleration': accel_tolerance
        }

        # Initialize data storage using dictionaries to reduce redundancy
        self.session_data = {
            'position': {'x': [], 'y': [], 'z': []},
            'velocity': {'x': [], 'y': [], 'z': []},
            'acceleration': {'x': [], 'y': [], 'z': []}
        }

        self.reference_data = {
            'position': {'x': [], 'y': [], 'z': []},
            'velocity': {'x': [], 'y': [], 'z': []},
            'acceleration': {'x': [], 'y': [], 'z': []}
        }

        self.compared_data = {
            'position': {'x': [], 'y': [], 'z': []},
            'velocity': {'x': [], 'y': [], 'z': []},
            'acceleration': {'x': [], 'y': [], 'z': []}
        }

    def dtw_compare_coords(self, start_frame, end_frame):
        """Calculate the DTW of two given lists of frames (w/ landmarks)
        and returns the average DTW of the coordinates of the session."""
        start = start_frame or 0
        session_length = len(self.session_data['position']['x'])
        end = end_frame or session_length

        # clip range so we don't go out of bounds
        end = min(end, session_length)
        ref_end = min(end, len(self.reference_data['position']['x']))  # keep ref in sync if lengths differ

        # Extract session and reference data using dictionary structure
        session_coords = {
            'x': self.session_data['position']['x'][start:end],
            'y': self.session_data['position']['y'][start:end],
            'z': self.session_data['position']['z'][start:end]
        }

        ref_coords = {
            'x': self.reference_data['position']['x'][start:ref_end],
            'y': self.reference_data['position']['y'][start:ref_end],
            'z': self.reference_data['position']['z'][start:ref_end]
        }

        # Calculate DTW for each coordinate axis
        dtw_scores = []
        for axis in ['x', 'y', 'z']:
            dtw_score = dtw.distance(session_coords[axis].flatten(), ref_coords[axis].flatten())
            dtw_scores.append(dtw_score)

        # Return average DTW score
        return np.mean(dtw_scores)

    def process_frame(self, frame):
        """Process a single frame of pose landmarks."""
        landmarks_list = frame.pose_landmarks

        # Extract coordinates from landmarks
        current_coords = {
            'x': np.array([landmarks.x for landmarks in landmarks_list]),
            'y': np.array([landmarks.y for landmarks in landmarks_list]),
            'z': np.array([landmarks.z for landmarks in landmarks_list])
        }

        # Append new coordinates to session data
        for axis in ['x', 'y', 'z']:
            self.session_data['position'][axis].append(current_coords[axis])

        # Calculate velocities if we have at least 2 frames
        if len(self.session_data['position']['x']) > 1:
            for axis in ['x', 'y', 'z']:
                velocity = (self.session_data['position'][axis][-1] - 
                           self.session_data['position'][axis][-2])
                self.session_data['velocity'][axis].append(velocity)

        # Calculate accelerations if we have at least 2 velocity frames
        if len(self.session_data['velocity']['x']) > 1:
            for axis in ['x', 'y', 'z']:
                acceleration = (self.session_data['velocity'][axis][-1] - 
                               self.session_data['velocity'][axis][-2])
                self.session_data['acceleration'][axis].append(acceleration)

        # Calculate differences for all data types (position, velocity, acceleration)
        for data_type in ['position', 'velocity', 'acceleration']:
            for axis in ['x', 'y', 'z']:
                diff = self._diff_with_tolerance(
                    self.reference_data[data_type][axis],
                    self.session_data[data_type][axis],
                    self.tolerances[data_type]
                )
                self.compared_data[data_type][axis].append(diff)
    
    def _diff_with_tolerance(self, ref_list, session_list, tolerance):
        """Calculate difference between reference and session data with tolerance threshold."""
        if tolerance is None:
            tolerance = 0
        
        # Ensure we have data to compare
        if not ref_list or not session_list:
            return np.array([])
        
        # Get the latest frame index
        frame_idx = len(session_list) - 1
        
        # Ensure reference data exists for this frame
        if frame_idx >= len(ref_list):
            return np.array([])
        
        # Calculate difference and apply tolerance
        diff = ref_list[frame_idx] - session_list[-1]
        diff[np.abs(diff) < tolerance] = 0
        return diff

    def load_reference_data(self, ref_data):
        """Load reference pose data for comparison.
        
        Args:
            ref_data: Dictionary containing reference data with structure:
                {
                    'position': {'x': [...], 'y': [...], 'z': [...]},
                    'velocity': {'x': [...], 'y': [...], 'z': [...]},
                    'acceleration': {'x': [...], 'y': [...], 'z': [...]}
                }
        """
        self.reference_data = ref_data

    def get_session_summary(self):
        """Get a summary of current session data."""
        summary = {}
        for data_type in ['position', 'velocity', 'acceleration']:
            summary[data_type] = {
                'frames': len(self.session_data[data_type]['x']),
                'axes': ['x', 'y', 'z']
            }
        return summary