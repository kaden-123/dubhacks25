import numpy as np
from dtaidistance import dtw
import pickle
from pathlib import Path

class PoseCompare:
    """Saves both the user's and reference video's position and motion vectors and their differences.

    Stores and updates the user's pose coordinates and creates motion vectors using the coordinates 
    if possible. PoseCompare also saves a reference video's coordinates and its motion vectors, which it
    uses to create an a Numpy array of differences. It is also possible to calculate a DTW score using 
    the user data and reference video data for different sections of the video.

    Parameters
    ---------
    pos_tolerance : int
        int that is used to filter out pos differences < than set tolerance
        (e.g. if difference is 4 and tolerance is 5, difference is set to 0)
    vel_tolerance: int
        int that is used to filter out vel differences < than set tolerance
    accel_tolerance: int
        int that is used to filter out accel differnences < than set tolerance

    Attributes
    ----------
    tolerances: dict
        dict that contains all the pos/motion tolerances
    session_data: dict
        dict that contains all the user's pos/motion data lists
    reference_data: dict
        dict that contains all the ref video's pos/motion data lists
    compared_data : dict
        dict that contains the compared data between user and ref video
    """
    def __init__(self,
                pos_tolerance = 0,
                vel_tolerance = 0,
                accel_tolerance = 0):

        # tolerances used for comparison ie if abs(diff) < tolerance, diff is set to 0
        self.tolerances = {
            'position': pos_tolerance,
            'velocity': vel_tolerance,
            'acceleration': accel_tolerance
        }
        # each element in x is a frame where each frame contains a numpy array containing
        # the x coordinates of each landmark 
        # (eg session_data[position][x][0] would return x coord of frame 0)
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
        """Calculates the DTW score of the position from set frame section
        
        Parameters
        ----------
        start_frame: int
            the starting frame to start calculating DTW from
        end_frame: int
            the ending frame to stop calculating DTW from

        Returns
        -------
        float
            The average DTW score between the x, y, and z coordinates
        """
        start = start_frame or 0
        session_length = len(self.session_data['position']['x'])
        end = end_frame or session_length

        # clip range so we don't go out of bounds
        end = min(end, session_length)
        ref_end = min(end, len(self.reference_data['position']['x']))  # keep ref in sync if lengths differ

        # get data pertaining to the frame bounds we want
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

        # calculate dtw and append to list for each frame
        # if performance intensive, could skip frames
        dtw_scores = []
        for axis in ['x', 'y', 'z']:
            dtw_score = dtw.distance(session_coords[axis].flatten(), ref_coords[axis].flatten())
            dtw_scores.append(dtw_score)

        return np.mean(dtw_scores)

    def process_frame(self, frame):
        """Processes a frame for pose data and compares it to ref video
        
        Updates session_data and compared_data using the new pose data from the frame

        Parameters
        ----------
        frame: PoseLandmarker Result (raw result after detecting pose)
            The frame's pose data that is to be processed/appended to the session data

        Returns
        -------
        None
        """
        landmarks_list = frame.pose_landmarks
        #flatten array
        landmarks_list = landmarks_list[0]

        # get landmarks from frame
        current_coords = {
            'x': np.array([landmarks.x for landmarks in landmarks_list]),
            'y': np.array([landmarks.y for landmarks in landmarks_list]),
            'z': np.array([landmarks.z for landmarks in landmarks_list])
        }
        print("Successfully got current coords!")

        # append new coord to dict
        for axis in ['x', 'y', 'z']:
            self.session_data['position'][axis].append(current_coords[axis])
        print("Successfully appended new coords to dict!")

        for axis in ['x', 'y', 'z']:
            # calc velocity if we have at least 2 positions
            if len(self.session_data['position'][axis]) > 1:
                velocity = self.session_data['position'][axis][-1] - self.session_data['position'][axis][-2]
                self.session_data['velocity'][axis].append(velocity)

                # calc accel if we have at least 2 vel
            if len(self.session_data['velocity'][axis]) > 1:
                acceleration = self.session_data['velocity'][axis][-1] - self.session_data['velocity'][axis][-2]
                self.session_data['acceleration'][axis].append(acceleration)
        print("Got past the calc vel and accel yay!")

        # calculate and append differences for all motion/position
        for data_type in ['position', 'velocity', 'acceleration']:
            for axis in ['x', 'y', 'z']:
                diff = self._diff_with_tolerance(
                    self.reference_data[data_type][axis],
                    self.session_data[data_type][axis],
                    self.tolerances[data_type]
                )
                print(f"diff is {diff}")
                print(f"axis: {axis}")
                print(f"data_type: {data_type}")
                self.compared_data[data_type][axis].append(diff)
        print("appended differences successfully!")
    
    def _diff_with_tolerance(self, ref_list, session_list, tolerance):
        """Calculate diff between reference and session data with tolerance threshold"""

        if len(ref_list) == 0: # if nothing in ref list just return 0
            return 0
        if tolerance is None:
            tolerance = 0
        
        # in if statement to prevent comparing non existent indexes if list is empty cause accel will be empty
        # until like three frames, OR i guess you can initilize those motion vectors with some values first idk.
        if len(session_list) >= 1:
            # get the latest frame index
            frame_idx = len(session_list) - 1
            # if latest frame in session is greater ref, fall back to last frame in reference.
            if frame_idx >= len(ref_list):
                frame_idx = len(ref_list) - 1
            
            # calc difference and apply tolerance
            diff = ref_list[frame_idx] - session_list[-1]
            diff[np.abs(diff) < tolerance] = 0
            return diff
        else:
            return 0
        
        

    # add non pickle support cause it only pickling
    def load_reference(self, media):
        """Loads this object with reference data

        Paramters
        ---------
        media: str
            name of the reference video that is to be loaded (include media format & abs path)
        """
        data = np.load(media, allow_pickle = True) 
        if isinstance(data, list): # cause i cant iterate over sometihng not a list yay
            for frame in data:
                landmarks_list = frame.pose_landmarks

                if not landmarks_list:
                    continue

                coords = {
                    'x': np.array([landmarks.x for landmarks in landmarks_list[0]]),
                    'y': np.array([landmarks.y for landmarks in landmarks_list[0]]),
                    'z': np.array([landmarks.z for landmarks in landmarks_list[0]])
                }

                for axis in ['x', 'y', 'z']:
                    self.reference_data['position'][axis].append(coords[axis])

            # create ref vel and accel stuff
            if len(self.reference_data['position']['x']) > 1:
                for axis in ['x', 'y', 'z']:
                    positions = self.reference_data['position'][axis]
                    velocities = [positions[i] - positions[i-1] for i in range(1, len(positions))]
                    self.reference_data['velocity'][axis] = velocities

                    if len(velocities) > 1:
                        accelerations = [velocities[i] - velocities[i-1] for i in range(1, len(velocities))]
                        self.reference_data['acceleration'][axis] = accelerations
        else: #this means we loaded an image
            landmarks_list = data.tolist().pose_landmarks
            coords = {
                    'x': np.array([landmarks.x for landmarks in landmarks_list[0]]),
                    'y': np.array([landmarks.y for landmarks in landmarks_list[0]]),
                    'z': np.array([landmarks.z for landmarks in landmarks_list[0]])
            }
            for axis in ['x', 'y', 'z']:
                self.reference_data['position'][axis].append(coords[axis])

