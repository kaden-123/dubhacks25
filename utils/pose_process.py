import mediapipe as mp
import numpy as np
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions, RunningMode
from mediapipe.tasks.python import BaseOptions

class ProcessPose:
    def __init__(self, model, 
                min_detection_confidence = 0.5,
                min_presence_confidence = 0.5,
                segmentation_masks = False):

        self.pose_model_path = f"./models/{model}"

        # min_pose_detection_confidence 
        #   = min confidence that there's a person to attempt to find landmarks
        # min_pose_presence_confidence 
        #   = min confidence whether pose seems present, landarks are only returned if reached
        self.options = PoseLandmarkerOptions(
            base_options = BaseOptions(model_asset_path=self.pose_model_path),
            running_mode = RunningMode.IMAGE,
            min_pose_detection_confidence = min_detection_confidence,
            min_pose_presence_confidence = min_presence_confidence,
            output_segmentation_masks = segmentation_masks
        )
        self.detector = PoseLandmarker.create_from_options(self.options)

    # filter is used to filter certain landmarks, image must be preloaded from mp.Image
    def process_image(self, image, filter = None):
        landmarks = self.detector.detect(image)
        return landmarks

    # takes in numpy image + raw landmarks
    def draw_annotation(self, image, landmarks):
        pose_landmarks_list = landmarks.pose_landmarks
        annotated_image = np.copy(image)

        # Loop through the detected poses to visualize.
        for idx in range(len(pose_landmarks_list)):
            pose_landmarks = pose_landmarks_list[idx]

            # Draw the pose landmarks.
            pose_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
            pose_landmarks_proto.landmark.extend([
            landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in pose_landmarks
            ])
            solutions.drawing_utils.draw_landmarks(
            annotated_image,
            pose_landmarks_proto,
            solutions.pose.POSE_CONNECTIONS,
            solutions.drawing_styles.get_default_pose_landmarks_style())
        return annotated_image