import subprocess
import shutil
import os
import sys

# Script to compress the heavy video assets of the website using FFmpeg.
# To run this script:
# 1. Install FFmpeg on your local machine (if not already installed).
# 2. Run: python optimize_videos.py

ASSETS_DIR = "assets"
NEWREEL_DIR = os.path.join(ASSETS_DIR, "newreel")
HERO_MOV = os.path.join(ASSETS_DIR, "IMG_6245.MOV")
HERO_MP4 = os.path.join(ASSETS_DIR, "IMG_6245.mp4")

def check_ffmpeg():
    if not shutil.which("ffmpeg"):
        print("[-] FFmpeg is not found in your system PATH.")
        print("Please install FFmpeg (https://ffmpeg.org) and make sure it is in your PATH.")
        return False
    return True

def compress_hero_video():
    if not os.path.exists(HERO_MOV):
        print(f"[-] Hero video '{HERO_MOV}' not found. Skipping main video compression.")
        return

    print(f"\n[*] Compressing Main Hero Video: {HERO_MOV}...")
    print("[*] Target Output: H.264 MP4, 720p, web-optimized fast-start, quality CRF 28.")
    
    # Command to compress:
    # -i: input file
    # -vf scale=1280:-2: Downscale to 720p width (keeping aspect ratio)
    # -vcodec libx264: H.264 video codec
    # -crf 28: Good quality compression (lower is better quality, higher is smaller size)
    # -preset fast: compression speed/efficiency trade-off
    # -acodec aac -b:a 128k: Audio compression
    # -movflags +faststart: Moves MOOV atom to front for progressive download / instant playing
    cmd = [
        "ffmpeg", "-y", "-i", HERO_MOV,
        "-vf", "scale=1280:-2",
        "-vcodec", "libx264", "-crf", "28", "-preset", "fast",
        "-acodec", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        HERO_MP4
    ]
    
    try:
        subprocess.run(cmd, check=True)
        orig_size = os.path.getsize(HERO_MOV) / (1024 * 1024)
        new_size = os.path.getsize(HERO_MP4) / (1024 * 1024)
        print(f"[+] Successfully compressed main hero video!")
        print(f"    Original Size: {orig_size:.2f} MB")
        print(f"    Optimized Size: {new_size:.2f} MB (Reduction: {(1 - new_size/orig_size)*100:.1f}%)")
    except subprocess.CalledProcessError as e:
        print(f"[-] Failed to compress main video: {e}")

def compress_reel_thumbnails():
    if not os.path.exists(NEWREEL_DIR):
        print(f"[-] Reel directory '{NEWREEL_DIR}' not found. Skipping thumbnails.")
        return
    
    print("\n[*] Compressing Reel Thumbnail Videos in assets/newreel...")
    videos = [f for f in os.listdir(NEWREEL_DIR) if f.lower().endswith(".mp4") and not f.startswith("opt_")]
    
    if not videos:
        print("[-] No MP4 video files found in assets/newreel.")
        return

    for video_name in videos:
        input_path = os.path.join(NEWREEL_DIR, video_name)
        temp_output_path = os.path.join(NEWREEL_DIR, f"opt_{video_name}")
        
        print(f"\n[*] Compressing thumbnail: {video_name} ({os.path.getsize(input_path) / (1024 * 1024):.2f} MB)...")
        print("[*] Target Output: H.264 MP4, 360p (narrow width), low framerate (24 fps), quality CRF 30.")
        
        # Reels are tiny vertical thumbnails. They do not need high resolution, high fps, or high bitrates.
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-vf", "scale=360:-2,fps=24",
            "-vcodec", "libx264", "-crf", "30", "-preset", "fast",
            "-an",  # Strip audio track to save bandwidth (reel previews are muted anyway!)
            "-movflags", "+faststart",
            temp_output_path
        ]
        
        try:
            subprocess.run(cmd, check=True)
            # Replace original file with the compressed one
            os.remove(input_path)
            os.rename(temp_output_path, input_path)
            new_size = os.path.getsize(input_path) / (1024 * 1024)
            print(f"[+] Compressed {video_name} successfully! New size: {new_size:.2f} MB")
        except subprocess.CalledProcessError as e:
            print(f"[-] Failed to compress {video_name}: {e}")
            if os.path.exists(temp_output_path):
                os.remove(temp_output_path)

if __name__ == "__main__":
    print("=== RR2 Website Video Optimization Script ===")
    if check_ffmpeg():
        compress_hero_video()
        compress_reel_thumbnails()
        print("\n[+] Video optimization complete!")
        print("[!] Note: Make sure to verify that the website loads and functions correctly.")
    else:
        sys.exit(1)
