const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const URL = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";
const BIN_DIR = path.join(__dirname, 'bin');
const FFMPEG_EXE = path.join(BIN_DIR, 'ffmpeg.exe');
const TEMP_ZIP = path.join(__dirname, 'temp_ffmpeg.zip');
const TEMP_DIR = path.join(__dirname, 'temp_ffmpeg_extracted');

function downloadFile(url, dest, callback) {
    https.get(url, (response) => {
        // Handle redirect (e.g. 301, 302)
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`[*] Following redirect to: ${response.headers.location}`);
            return downloadFile(response.headers.location, dest, callback);
        }

        if (response.statusCode !== 200) {
            console.error(`[-] Server returned status code: ${response.statusCode}`);
            return;
        }

        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
            file.close(callback);
        });
    }).on('error', (err) => {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.error("[-] Download error:", err.message);
    });
}

async function downloadFFmpeg() {
    if (!fs.existsSync(BIN_DIR)) {
        fs.mkdirSync(BIN_DIR, { recursive: true });
    }

    console.log("[*] Downloading FFmpeg essentials build (approx. 70MB)...");

    downloadFile(URL, TEMP_ZIP, () => {
        console.log("[+] Download complete!");
        try {
            console.log("[*] Extracting archive via PowerShell...");
            if (fs.existsSync(TEMP_DIR)) {
                fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            }
            fs.mkdirSync(TEMP_DIR);

            // Run PowerShell extraction
            execSync(`powershell -Command "Expand-Archive -Path '${TEMP_ZIP}' -DestinationPath '${TEMP_DIR}' -Force"`);
            console.log("[+] Extraction complete!");

            // Find ffmpeg.exe inside the extracted directory recursively
            function findFile(dir, filename) {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        const found = findFile(fullPath, filename);
                        if (found) return found;
                    } else if (file === filename) {
                        return fullPath;
                    }
                }
                return null;
            }

            const extractedFfmpeg = findFile(TEMP_DIR, 'ffmpeg.exe');
            if (extractedFfmpeg) {
                fs.copyFileSync(extractedFfmpeg, FFMPEG_EXE);
                console.log(`[+] Successfully saved ffmpeg.exe to ${FFMPEG_EXE}`);
            } else {
                console.error("[-] Could not find ffmpeg.exe in the extracted archive.");
            }
        } catch (err) {
            console.error("[-] Extraction failed:", err.message);
        } finally {
            // Cleanup
            console.log("[*] Cleaning up temporary files...");
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
            if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            console.log("[+] Cleanup complete!");
        }
    });
}

downloadFFmpeg();
