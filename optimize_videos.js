const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, 'assets');
const NEWREEL_DIR = path.join(ASSETS_DIR, 'newreel');
const FFMPEG_PATH = path.join(__dirname, 'bin', 'ffmpeg.exe');
const HERO_MOV = path.join(ASSETS_DIR, 'IMG_6245.MOV');
const HERO_MP4 = path.join(ASSETS_DIR, 'IMG_6245.mp4');

function checkFfmpeg() {
    if (!fs.existsSync(FFMPEG_PATH)) {
        console.error("[-] FFmpeg not found at " + FFMPEG_PATH);
        console.error("Please run 'node download_ffmpeg.js' first.");
        return false;
    }
    return true;
}

function compressHeroVideo() {
    if (!fs.existsSync(HERO_MOV)) {
        console.log(`[-] Hero video '${HERO_MOV}' not found. Skipping main video compression.`);
        return;
    }
    console.log(`\n[*] Compressing Main Hero Video: ${HERO_MOV}...`);
    console.log("[*] Target Output: H.264 MP4, 720p, web-optimized fast-start, quality CRF 28.");
    const cmd = `"${FFMPEG_PATH}" -y -i "${HERO_MOV}" -vf scale=1280:-2 -vcodec libx264 -crf 28 -preset fast -acodec aac -b:a 128k -movflags +faststart "${HERO_MP4}"`;
    try {
        execSync(cmd, { stdio: 'inherit' });
        const origSize = fs.statSync(HERO_MOV).size / (1024 * 1024);
        const newSize = fs.statSync(HERO_MP4).size / (1024 * 1024);
        console.log(`[+] Successfully compressed main hero video!`);
        console.log(`    Original Size: ${origSize.toFixed(2)} MB`);
        console.log(`    Optimized Size: ${newSize.toFixed(2)} MB (Reduction: ${((1 - newSize / origSize) * 100).toFixed(1)}%)`);
    } catch (e) {
        console.error(`[-] Failed to compress main video: ${e.message}`);
    }
}
function compressReelThumbnails() {
    if (!fs.existsSync(NEWREEL_DIR)) {
        console.log(`[-] Reel directory '${NEWREEL_DIR}' not found. Skipping thumbnails.`);
        return;
    }
    console.log("\n[*] Compressing Reel Thumbnail Videos in assets/newreel...");
    const files = fs.readdirSync(NEWREEL_DIR);
    const videos = files.filter(f => f.toLowerCase().endsWith(".mp4"));

    // Filter out temporary/already opt files if any start with "opt_"
    const targetVideos = videos.filter(f => !f.startsWith("opt_"));
    if (targetVideos.length === 0) {
        console.log("[-] No MP4 video files found in assets/newreel.");
        return;
    }
    for (const videoName of targetVideos) {
        const inputPath = path.join(NEWREEL_DIR, videoName);
        const tempOutputPath = path.join(NEWREEL_DIR, `opt_${videoName}`);
        const origSizeMB = fs.statSync(inputPath).size / (1024 * 1024);

        console.log(`\n[*] Compressing thumbnail: ${videoName} (${origSizeMB.toFixed(2)} MB)...`);
        console.log("[*] Target Output: H.264 MP4, 360p, low framerate (24 fps), quality CRF 30.");

        const cmd = `"${FFMPEG_PATH}" -y -i "${inputPath}" -vf "scale=360:-2,fps=24" -vcodec libx264 -crf 30 -preset fast -an -movflags +faststart "${tempOutputPath}"`;
        try {
            execSync(cmd, { stdio: 'inherit' });
            // Replace original file with the compressed one
            fs.unlinkSync(inputPath);
            fs.renameSync(tempOutputPath, inputPath);
            const newSize = fs.statSync(inputPath).size / (1024 * 1024);
            console.log(`[+] Compressed ${videoName} successfully! New size: ${newSize.toFixed(2)} MB`);
        } catch (e) {
            console.error(`[-] Failed to compress ${videoName}: ${e.message}`);
            if (fs.existsSync(tempOutputPath)) {
                fs.unlinkSync(tempOutputPath);
            }
        }
    }
}

function main() {
    console.log("=== RR2 Website Video Optimization Starting (using Node & local FFmpeg) ===");
    if (checkFfmpeg()) {
        compressHeroVideo();
        compressReelThumbnails();
        console.log("\n[+] Video optimization complete!");
    }
}

main();
