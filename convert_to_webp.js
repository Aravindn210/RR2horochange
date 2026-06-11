const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WORK_DIR = __dirname;
const IGNORE_DIRS = ['node_modules', '.git', '.github', '.vscode', '.agents'];

// Recursively find all images
function findImages(dir, extensions) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                results = results.concat(findImages(fullPath, extensions));
            }
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

async function run() {
    console.log("Starting WebP Conversion...");
    const extensions = ['.png', '.jpg', '.jpeg'];
    const images = findImages(WORK_DIR, extensions);
    console.log(`Found ${images.length} images to convert.`);

    let totalSaved = 0;

    for (const img of images) {
        const ext = path.extname(img.path);
        const webpPath = img.path.substring(0, img.path.length - ext.length) + '.webp';
        console.log(`Converting: ${path.relative(WORK_DIR, img.path)} -> ${path.relative(WORK_DIR, webpPath)}`);
        
        try {
            // Convert to webp with high quality (e.g. 85)
            await sharp(img.path)
                .webp({ quality: 85 })
                .toFile(webpPath);
            
            const newSize = fs.statSync(webpPath).size;
            const saved = img.size - newSize;
            totalSaved += saved;
            console.log(`[Success] Size: ${(img.size / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (Saved ${(saved / 1024).toFixed(1)} KB)`);
            
            // Delete original
            fs.unlinkSync(img.path);
        } catch (err) {
            console.error(`[Error] Failed to convert ${img.path}:`, err.message);
        }
    }
    console.log(`All conversions complete! Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

run();
