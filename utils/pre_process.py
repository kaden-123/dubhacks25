import cv2
import mediapipe as mp
import numpy as np
from pathlib import Path
from utils import ProcessPose

BASE_DIR = Path(__file__).resolve().parent
image_dir = BASE_DIR / "data" / "images"
video_dir = BASE_DIR / "data" / "videos"

image_dir.mkdir(parents = True, exist_ok = True)
video_dir.mkdir(parents = True, exist_ok = True)

image_paths = sorted(list(image_dir.glob("*.*")))
video_paths = sorted(list(video_dir.glob("*.*")))

def choose_file(file_list):
    print("Select file to Process")
    for i, f in enumerate(file_list):
        print(f"{i}: {f.name}")
    
    choice = int(input(f"Select a File by number: "))
    return file_list[choice]

def process_video(video):
    video_path = f'/Users/kadenwu/Workspace/Vibedance/data/{video}'
    video = cv2.VideoCapture()

def process_image(image):
    process_pose = ProcessPose("pose_landmarker_lite.task")
    mp_image = mp.Image.create_from_file(str(image_dir))
