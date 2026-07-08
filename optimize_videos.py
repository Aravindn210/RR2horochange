import os
import subprocess
import shutil
import sys
from pathlib import Path
import logging
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed

# -------------------------- Configuration --------------------------
DEFAULT_HERO_RES = 720  # height in pixels (width auto‑scaled)
DEFAULT_HERO_CRF = 28
DEFAULT_THUMB_RES = 360  # height in pixels
DEFAULT_THUMB_FPS = 24
DEFAULT_THUMB_CRF = 30
DEFAULT_PARALLEL_WORKERS = 4

ASSETS_DIR = Path("assets")
NEWREEL_DIR = ASSETS_DIR / "newreel"
HERO_MOV = ASSETS_DIR / "IMG_6245.MOV"
HERO_MP4 = ASSETS_DIR / "IMG_6245.mp4"

# -------------------------- Helper Functions --------------------------

def get_ffmpeg_path() -> Path | None:
    """Return a Path to the ffmpeg executable.
    Checks a local `bin/ffmpeg.exe` first, then falls back to the system PATH.
    """
    local_path = Path("bin") / "ffmpeg.exe"
    if local_path.is_file():
        return local_path
    system_path = shutil.which("ffmpeg")
    if system_path:
        return Path(system_path)
    return None


def check_ffmpeg(logger: logging.Logger) -> bool:
    if not get_ffmpeg_path():
        logger.error("FFmpeg not found. Install it or run 'download_ffmpeg.py'.")
        return False
    logger.debug(f"FFmpeg found at {get_ffmpeg_path()}")
    return True


def configure_logging(level: str) -> logging.Logger:
    numeric = getattr(logging, level.upper(), logging.INFO)
    logging.basicConfig(
        level=numeric,
        format="[%(levelname)s] %(message)s",
    )
    return logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="RR2 website video optimization script.")
    parser.add_argument("--hero-crf", type=int, default=DEFAULT_HERO_CRF,
                        help="CRF for hero video compression")
    parser.add_argument("--thumb-res", type=int, default=DEFAULT_THUMB_RES,
                        help="Target height for thumbnail videos")
    parser.add_argument("--parallel", type=int, default=DEFAULT_PARALLEL_WORKERS,
                        help="Number of parallel workers for thumbnail processing")
    parser.add_argument("--thumb-fps", type=int, default=DEFAULT_THUMB_FPS,
                        help="Frames per second for thumbnail videos")
    parser.add_argument("--thumb-crf", type=int, default=DEFAULT_THUMB_CRF,
                        help="CRF for thumbnail video compression")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show FFmpeg commands without executing them")
    parser.add_argument("--hero-res", type=int, default=DEFAULT_HERO_RES,
                        help="Target height for hero video (width auto‑scaled)")
    parser.add_argument("--log-level", default="INFO",
                        help="Logging level (DEBUG, INFO, WARNING, ERROR)")
    return parser.parse_args()


def compress_video(input_path: Path, output_path: Path, ffmpeg_opts: list[str], dry_run: bool, logger: logging.Logger) -> bool:
    """Run ffmpeg with the supplied options.
    Returns True on success, False otherwise.
    """
    cmd = [str(get_ffmpeg_path()), "-y", "-i", str(input_path)] + ffmpeg_opts + [str(output_path)]
    logger.debug(f"FFmpeg command: {' '.join(cmd)}")
    if dry_run:
        logger.info(f"Dry‑run: would execute {' '.join(cmd)}")
        return True
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        logger.debug(f"FFmpeg stdout: {result.stdout}")
        logger.debug(f"FFmpeg stderr: {result.stderr}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg failed for {input_path.name}: {e}")
        return False


def report_size_change(original: Path, compressed: Path, logger: logging.Logger) -> float:
    """Return percentage reduction (positive if compressed is smaller)."""
    orig_size = original.stat().st_size / (1024 * 1024)
    new_size = compressed.stat().st_size / (1024 * 1024)
    reduction = (1 - new_size / orig_size) * 100 if orig_size else 0.0
    logger.info(
        f"{original.name}: {orig_size:.2f} MB → {new_size:.2f} MB "
        f"({reduction:.1f}% reduction)"
    )
    return orig_size - new_size  # saved MB


def compress_hero(args: argparse.Namespace, logger: logging.Logger) -> tuple[float, float]:
    if not HERO_MOV.is_file():
        logger.warning(f"Hero video not found at {HERO_MOV}")
        return 0.0, 0.0
    logger.info(f"Compressing hero video: {HERO_MOV.name}")
    ffmpeg_opts = [
        "-vf", f"scale=-2:{args.hero_res}",
        "-vcodec", "libx264",
        "-crf", str(args.hero_crf),
        "-preset", "fast",
        "-acodec", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
    ]
    success = compress_video(HERO_MOV, HERO_MP4, ffmpeg_opts, args.dry_run, logger)
    if not success:
        return 0.0, 0.0
    if args.dry_run:
        return 0.0, 0.0
    saved = report_size_change(HERO_MOV, HERO_MP4, logger)
    return saved, HERO_MOV.stat().st_size / (1024 * 1024)


def list_thumbnail_videos() -> list[Path]:
    if not NEWREEL_DIR.is_dir():
        return []
    return [NEWREEL_DIR / f for f in os.listdir(NEWREEL_DIR)
            if f.lower().endswith('.mp4') and not f.startswith('opt_')]


def compress_thumbnail(video_path: Path, args: argparse.Namespace, logger: logging.Logger) -> tuple[float, float]:
    if not video_path.is_file():
        logger.warning(f"File missing: {video_path}")
        return 0.0, 0.0
    logger.info(f"Compressing thumbnail: {video_path.name}")
    temp_output = video_path.parent / f"opt_{video_path.name}"
    ffmpeg_opts = [
        "-vf", f"scale=-2:{args.thumb_res},fps={args.thumb_fps}",
        "-vcodec", "libx264",
        "-crf", str(args.thumb_crf),
        "-preset", "fast",
        "-an",  # strip audio
        "-movflags", "+faststart",
    ]
    success = compress_video(video_path, temp_output, ffmpeg_opts, args.dry_run, logger)
    if not success:
        return 0.0, 0.0
    if args.dry_run:
        return 0.0, 0.0
    # Verify compression actually reduced size before replacing
    orig_size = video_path.stat().st_size
    new_size = temp_output.stat().st_size
    if new_size >= orig_size:
        logger.warning(f"Compressed file not smaller; keeping original {video_path.name}")
        temp_output.unlink()
        return 0.0, orig_size / (1024 * 1024)
    # Replace original with compressed version
    video_path.unlink()
    temp_output.rename(video_path)
    saved = (orig_size - new_size) / (1024 * 1024)
    logger.info(
        f"{video_path.name}: {orig_size/(1024*1024):.2f} MB → {new_size/(1024*1024):.2f} MB "
        f"({(saved / (orig_size/(1024*1024)) * 100):.1f}% reduction)"
    )
    return saved, orig_size / (1024 * 1024)


def main():
    args = parse_args()
    logger = configure_logging(args.log_level)
    if not check_ffmpeg(logger):
        sys.exit(1)

    total_saved = 0.0
    total_original = 0.0

    # Hero video processing
    saved, orig = compress_hero(args, logger)
    total_saved += saved
    total_original += orig

    # Thumbnail processing (parallel)
    thumbnails = list_thumbnail_videos()
    if not thumbnails:
        logger.info("No thumbnail videos found to process.")
    else:
        with ThreadPoolExecutor(max_workers=args.parallel) as executor:
            futures = {executor.submit(compress_thumbnail, vid, args, logger): vid for vid in thumbnails}
            for future in as_completed(futures):
                saved, orig = future.result()
                total_saved += saved
                total_original += orig

    if total_original > 0:
        overall_reduction = (total_saved / total_original) * 100
        logger.info(f"Overall size reduction: {overall_reduction:.1f}% ({total_saved:.2f} MB saved)")
    else:
        logger.info("No videos were processed.")

    logger.info("Video optimization complete.")

if __name__ == "__main__":
    main()
