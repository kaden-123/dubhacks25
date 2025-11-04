import cv2
import mediapipe as mp
import numpy as np
import os
import pickle
from pathlib import Path
from utils import ProcessPose

BASE_DIR = Path(__file__).resolve().parent

image_dir = BASE_DIR / "data" / "pre" / "images"
video_dir = BASE_DIR / "data" / "pre" / "videos"

image_data_dir = BASE_DIR / "data" / "post" / "images"
video_data_dir = BASE_DIR / "data" / "post" / "videos"

image_paths = sorted(list(image_dir.glob("*.*")))
video_paths = sorted(list(video_dir.glob("*.*")))

def process_video(model):
    video_path = str(choose_file(video_paths))
    video = cv2.VideoCapture(video_path)

    process_pose = ProcessPose(model)
    frame_idx = 0
    result = []

    while True:
        success, frame = video.read()
        if not success:
            break
    
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        result.append(process_pose.process_image(mp_image))

        frame_idx += 1
    
    file_name = os.path.splitext(os.path.basename(video_path))[0]
    
    save_path = video_data_dir / f"{file_name}.pkl"
    with open(save_path, "wb") as f:
        pickle.dump(result, f)

def process_image(model):
    image_path = str(choose_file(image_paths))
    
    process_pose = ProcessPose(model)
    mp_image = mp.Image.create_from_file(image_path)
    
    result = np.array(process_pose.process_image(mp_image))
    file_name = os.path.splitext(os.path.basename(image_path))[0]
    
    save_path = image_data_dir / f"{file_name}.pkl"
    np.save(save_path, result)

def choose_file(file_list):
    print("Select file to Process")
    for i, f in enumerate(file_list):
        print(f"{i}: {f.name}")
    
    choice = int(input(f"Select a File by number: "))
    return file_list[choice]

def main():
    print("Select what to process:")
    print("1: Process a video")
    print("2: Process an image")
    
    choice = input("Enter 1 or 2: ").strip()

    model = "pose_landmarker_lite.task"  

    if choice == "1":
        process_video(model)
    elif choice == "2":
        process_image(model)
    else:
        print("Invalid choice. Please enter 1 or 2.")
        main() 

main()
