const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'assets');

// Recursively get all files in a directory matching extensions
function getFiles(dir, extensions) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath, extensions));
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (extensions.includes(ext)) {
                results.push({
                    path: fullPath,
                    size: stat.size
                });
            }
        }
    });
    return results;
}

async function optimizeImages() {
    console.log("=== Image Batch Optimization Starting (using Sharp with buffer fix) ===");
    console.log(`Scanning assets directory: ${ASSETS_DIR}...`);

    const imageExtensions = ['.webp'];
    const files = getFiles(ASSETS_DIR, imageExtensions);

    console.log(`Found ${files.length} WebP image files in assets folder.\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let optimizedCount = 0;

    for (const file of files) {
        const relativePath = path.relative(__dirname, file.path);
        const sizeMB = file.size / (1024 * 1024);

        let shouldOptimize = false;
        let maxWidth = 1600;

        // Custom thresholds depending on folder
        if (relativePath.includes('assets' + path.sep + 'team')) {
            // Team avatar photos: target 600px max width, optimize if > 200KB
            maxWidth = 600;
            if (file.size > 200 * 1024) {
                shouldOptimize = true;
            }
        } else if (file.size > 500 * 1024) {
            // General portfolio photos: target 1600px max width, optimize if > 500KB
            maxWidth = 1600;
            shouldOptimize = true;
        }

        totalOriginalSize += file.size;

        if (!shouldOptimize) {
            totalOptimizedSize += file.size;
            continue;
        }

        console.log(`[*] Processing: ${relativePath} (${sizeMB.toFixed(2)} MB)`);

        try {
            // Read file into buffer first to avoid file lock on Windows
            const fileBuffer = fs.readFileSync(file.path);
            const img = sharp(fileBuffer);
            const metadata = await img.metadata();

            let buffer;
            if (metadata.width > maxWidth) {
                buffer = await sharp(fileBuffer)
                    .resize({ width: maxWidth })
                    .webp({ quality: 80 })
                    .toBuffer();
            } else {
                buffer = await sharp(fileBuffer)
                    .webp({ quality: 80 })
                    .toBuffer();
            }

            // Write back in place
            fs.writeFileSync(file.path, buffer);
            
            const optimizedSize = fs.statSync(file.path).size;
            totalOptimizedSize += optimizedSize;
            optimizedCount++;

            const savedMB = (file.size - optimizedSize) / (1024 * 1024);
            const pct = ((1 - optimizedSize / file.size) * 100).toFixed(1);
            console.log(`    [+] Done! New size: ${(optimizedSize / (1024 * 1024)).toFixed(2)} MB (Reduced: ${pct}%, saved ${savedMB.toFixed(2)} MB)`);
        } catch (err) {
            console.error(`    [-] Error processing ${relativePath}: ${err.message}`);
            totalOptimizedSize += file.size; // fallback to original size
        }
    }

    const totalSavedMB = (totalOriginalSize - totalOptimizedSize) / (1024 * 1024);
    const totalOriginalSizeMB = totalOriginalSize / (1024 * 1024);
    const totalOptimizedSizeMB = totalOptimizedSize / (1024 * 1024);
    const overallPct = totalOriginalSize > 0 ? ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1) : 0;

    console.log("\n==========================================================");
    console.log("            IMAGE OPTIMIZATION COMPLETE STATUS            ");
    console.log("==========================================================");
    console.log(`Total Images Processed/Optimized: ${optimizedCount} files`);
    console.log(`Original WebP Images Size:       ${totalOriginalSizeMB.toFixed(2)} MB`);
    console.log(`Optimized WebP Images Size:      ${totalOptimizedSizeMB.toFixed(2)} MB`);
    console.log(`Total Storage Saved:             ${totalSavedMB.toFixed(2)} MB`);
    console.log(`Overall Compression Ratio:        ${overallPct}% size reduction`);
    console.log("==========================================================");
}

optimizeImages().catch(err => {
    console.error("Fatal error running image optimization:", err);
});
