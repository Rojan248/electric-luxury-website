import cv2
import os

video_path = os.path.join("Frames2", "upscaled-video.mp4")
output_dir = "Frames2"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print(f"Error: Could not open video file {video_path}")
    exit(1)

frame_count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame_count += 1
    filename = os.path.join(output_dir, f"frame_{frame_count:04d}.png")
    cv2.imwrite(filename, frame)
    
    if frame_count % 100 == 0:
        print(f"Extracted {frame_count} frames...")

cap.release()
print(f"Done! Extracted {frame_count} frames to {output_dir}")
