import os, sys, subprocess
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def resize_images(directory, max_width=1920):
    dir_path = Path(directory)
    if not dir_path.exists():
        print(f"Directory {directory} not found.")
        return
    files = sorted(dir_path.glob("*.png"))
    total = len(files)
    if total == 0:
        print(f"No PNG files found in {directory}.")
        return
    print(f"Found {total} images in {directory}. Resizing to max {max_width}px width...")
    resized = 0
    for i, fp in enumerate(files):
        try:
            with Image.open(fp) as img:
                w, h = img.size
                if w > max_width:
                    ratio = max_width / w
                    new_h = int(h * ratio)
                    img.resize((max_width, new_h), Image.Resampling.LANCZOS).save(fp, optimize=True)
                    resized += 1
                    if (i+1) % 20 == 0:
                        print(f"  [{i+1}/{total}] {fp.name}: {w}x{h} -> {max_width}x{new_h}")
        except Exception as e:
            print(f"Error: {fp.name}: {e}")
    print(f"Done. Resized {resized}/{total} images.")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "frames3"
    resize_images(target)
