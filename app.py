import streamlit as st
from streamlit_webrtc import webrtc_streamer
import mediapipe as mp
import cv2
from av import VideoFrame

from utils import ProcessPose

process_image = ProcessPose("pose_landmarker_lite.task")

def image_processing(frame):
    try: 
        numpy_image = frame.to_ndarray(format="bgr24")
        numpy_image = cv2.resize(numpy_image, (320, 240))
        numpy_image = cv2.flip(numpy_image, 1)

        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(numpy_image, cv2.COLOR_BGR2RGB))

        landmarks = process_image.process_image(mp_image)

        annotated_image = process_image.draw_annotation(numpy_image, landmarks)
        annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)


        return VideoFrame.from_ndarray(annotated_image_rgb, format="rgb24")
    
    except Exception as e:
        print("Error processing frame:", e)
        return frame.to_ndarray(format="bgr24")


webrtc_streamer(key="test",
                video_frame_callback=image_processing,
                media_stream_constraints={"video": True, "audio": False},
                async_processing=True)