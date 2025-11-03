import mediapipe as mp
import numpy as np
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions, RunningMode
from mediapipe.tasks.python import BaseOptions

class ProcessPose:
    """Is able to create and use a MediaPipe pose detector to process and annotate images

    Paramters
    ---------
    model: str
        Name of the MediaPipe pose model that is to be used
        (e.g. pose_landmarker_lite.task)
    min_detection_confidence: float
        min confidence needed for Pose to start tracking an individual
    min_prescence_confidence: float
        min confidence needed for Pose to not reset tracking
    segmentation_masks: boolean
        option to append a segmentation mask to output

    Attributes
    ----------
    detector: PoseLandmarker
        obj used to detect poses ie detector.detect()
    """
    def __init__(self, model, 
                min_detection_confidence = 0.5,
                min_presence_confidence = 0.5,
                segmentation_masks = False):

        self._pose_model_path = f"./models/{model}"

        # min_pose_detection_confidence 
        #   = min confidence that there's a person to attempt to find landmarks
        # min_pose_presence_confidence 
        #   = min confidence whether pose seems present, landarks are only returned if reached
        self._options = PoseLandmarkerOptions(
            base_options = BaseOptions(model_asset_path=self._pose_model_path),
            running_mode = RunningMode.IMAGE,
            min_pose_detection_confidence = min_detection_confidence,
            min_pose_presence_confidence = min_presence_confidence,
            output_segmentation_masks = segmentation_masks
        )
        self.detector = PoseLandmarker.create_from_options(self._options)

    def process_image(self, image, filter = None):
        """Processes an image using pose detector and filters the result if needed

        Parameters
        ----------
        image: mp.Image
            the image that is used to create the pose data
        filter: list
            used to filter certain landmarks (exclude from result)
            filter is to be in pair like [(1,3), (5,6)] etc

        Returns
        -------
        A filtered/non-filtered PoseLandmarker result
        """
        landmarks = self.detector.detect(image)
        if filter:
            for start, end in filter:
                del landmarks.pose_landmarks[0][start:end]
        return landmarks

    # takes in numpy image + raw landmarks
    def draw_annotation(self, image, landmarks):
        """Draws annotations onto an image using landmarks

        Parameters
        ----------
        image: numpy image
            the image where landmarks are to be drawn on
        landmarks: PoseLandmarker result
            the raw output of the pose detector which is used to draw the
            pose detection on the image

        Returns
        -------
        numpy image
            an image with a drawn pose detection result
        """
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
                solutions.drawing_styles.get_default_pose_landmarks_style()
            )
        return annotated_image