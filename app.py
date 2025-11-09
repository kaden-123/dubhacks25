import streamlit as st
from streamlit_webrtc import webrtc_streamer
import mediapipe as mp
import cv2
from pathlib import Path
from av import VideoFrame
import time

from utils import ProcessPose
from utils import PoseCompare
from utils import thresh

last_update = time.time()
update_interval = 1.0

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

accuracy_display = st.empty()
st.session_state.error_sum = st.session_state.get("error_sum", 0)
st.session_state.num_frame = st.session_state.get("num_frame", 1)
st.session_state.accuracy = st.session_state.get("accuracy", 0)
print("set error_sum and num_frame to 0!")

# returns annotated image with pose data
def image_processing(frame):
    try: 
        print(f"Frame Number: {st.session_state.num_frame}")
        numpy_image = frame.to_ndarray(format="bgr24")
        numpy_image = cv2.resize(numpy_image, (320, 240))

        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(numpy_image, cv2.COLOR_BGR2RGB))

        # process image and load into compare class
        landmarks = process_image.process_image(mp_image)
        print("processed landmarks in image!")
        pose_compare.process_frame(landmarks)
        print("processed data!")

        st.session_state.error_sum += thresh(pose_compare.compared_data)
        print(f"Error sum is {st.session_state.error}")

        if  st.session_state.num_frame % 30 == 0: # update every 30th frame
            accuracy =  st.session_state.error_sum / ( st.session_state.num_frame * 3) # cause 3 points and thresh calculates error per point
            st.session_state.accuracy = accuracy
        print(f"Accuracy is {st.session_state.accuracy}")
        st.session_state.num_frame += 1

        # a bunch of image transformations and stuff to make things compat
        annotated_image = process_image.draw_annotation(numpy_image, landmarks)
        annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
        annotated_image_rgb = cv2.flip(annotated_image_rgb, 1)

        return VideoFrame.from_ndarray(annotated_image_rgb, format="rgb24")
    
    except Exception as e:
        print("Error processing frame:", e)
        fallback = frame.to_ndarray(format="bgr24")
        return VideoFrame.from_ndarray(fallback, format="bgr24")

webrtc_streamer(key="test",
                video_frame_callback=image_processing,
                media_stream_constraints={"video": True, "audio": False},
                async_processing=True)
accuracy_display.metric(label="Accuracy", value=f"{st.session_state.accuracy:.4f}%")


    
