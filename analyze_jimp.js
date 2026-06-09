const { Jimp, intToRGBA } = require('jimp');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\aravi\\.gemini\\antigravity-ide\\brain\\253c52b2-27d0-4c6f-bf93-aa0863c17002';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

async function analyze() {
    for (const file of files) {
        const filepath = path.join(dir, file);
        try {
            const image = await Jimp.read(filepath);
            let colorVarianceSum = 0;
            let pixelCount = 0;
            
            // Sample pixels
            for (let y = 0; y < image.bitmap.height; y += 20) {
                for (let x = 0; x < image.bitmap.width; x += 20) {
                    const pixelColor = image.getPixelColor(x, y);
                    const rgba = intToRGBA(pixelColor);
                    
                    const mean = (rgba.r + rgba.g + rgba.b) / 3;
                    const variance = (
                        Math.pow(rgba.r - mean, 2) + 
                        Math.pow(rgba.g - mean, 2) + 
                        Math.pow(rgba.b - mean, 2)
                    ) / 3;
                    
                    colorVarianceSum += Math.sqrt(variance);
                    pixelCount++;
                }
            }
            
            const avgVariance = colorVarianceSum / pixelCount;
            console.log(`${file}: Avg RGB Variance = ${avgVariance.toFixed(2)} (${avgVariance < 3 ? 'GRAYSCALE/B&W' : 'COLOR'})`);
        } catch (e) {
            console.log(file, 'error:', e.message);
        }
    }
}

analyze();
