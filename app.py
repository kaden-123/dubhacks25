import streamlit as st
from streamlit_webrtc import webrtc_streamer
import mediapipe as mp
import cv2
from pathlib import Path
from av import VideoFrame
import threading
import time

from utils import ProcessPose
from utils import PoseCompare
from utils import thresh


process_image = ProcessPose("pose_landmarker_lite.task")
pose_compare = PoseCompare(0, 0, 0)

BASE_DIR = Path(__file__).resolve().parent
MEDIA_BASE = BASE_DIR / "data" / "post"

# iterate through data to find all data files
media_files = {}
for file_path in MEDIA_BASE.rglob("*.*"):
    media_name = file_path.stem
    media_files[media_name] = file_path

# select one data file
selected_media = st.selectbox("Please select a song",
                    sorted(media_files.keys()),
                    placeholder = "Select song NOW")

# load selected file into class
selected_file = media_files[selected_media]
pose_compare.load_reference(selected_file)

# Global state
tracker = {
    "num_frame": 1,
    "error_sum": 0,
    "accuracy": 0
}

def image_processing(frame):
    try:
        print(f"Frame Number: {tracker['num_frame']}")
        # convert frame to numpy array
        numpy_image = frame.to_ndarray(format="bgr24")
        numpy_image = cv2.resize(numpy_image, (320, 240))

        # process frame
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=cv2.cvtColor(numpy_image, cv2.COLOR_BGR2RGB)
        )
        landmarks = process_image.process_image(mp_image)
        print("processed landmarks in image!")
        pose_compare.process_frame(landmarks)
        print("processed data!")

        # calculate error
        error = thresh(pose_compare.compared_data)
        tracker["error_sum"] += error
        print(f"Error sum is {tracker['error_sum']}")

        # calculate accuracy every 30 frames
        if tracker["num_frame"] % 30 == 0:
            tracker["accuracy"] = tracker["error_sum"] / (tracker["num_frame"] * 3 * 33)  # cause 3 points and thresh calculates error per point
            # yes i hard coded 33 for the # of landmarks cause im desperate and i just want this to work pls help
        print(f"Accuracy is {tracker['accuracy']}")

        tracker["num_frame"] += 1

        # a bunch of image transformations and stuff to make things compat
        annotated_image = process_image.draw_annotation(numpy_image, landmarks)
        annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
        annotated_image_rgb = cv2.flip(annotated_image_rgb, 1)

        return VideoFrame.from_ndarray(annotated_image_rgb, format="rgb24")

    except Exception as e:
        print("Error processing frame:", e)
        fallback = frame.to_ndarray(format="bgr24")
        return VideoFrame.from_ndarray(fallback, format="rgb24")


# placeholder for accuracy metric
accuracy_display = st.empty()  # placeholder

# start WebRTC streamer
webrtc_streamer(
    key="test",
    video_frame_callback=image_processing,
    media_stream_constraints={"video": True, "audio": False},
    async_processing=True
)

# gonna use a while loop for now, note that anything below this will NOT update accordingly
while True:
    accuracy_display.metric("Accuracy", f"{tracker['accuracy']:.2f}%")
    time.sleep(1)


