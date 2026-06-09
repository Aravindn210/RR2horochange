const fs = require('fs');
const path = require('path');

function updateGallery(filename, imgDir) {
    const fullPath = path.join('d:/RR2/heroscetionchnage/RR2website-main', filename);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Read all files in the directory
    const dirPath = path.join('d:/RR2/heroscetionchnage/RR2website-main/assets/RR2.photos/new', imgDir);
    let allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
    
    // Filter out duplicate downloads like "image (1).webp"
    const uniqueFiles = [];
    allFiles.forEach(file => {
        const match = file.match(/^(.*) \(\d+\)(\.\w+)$/);
        if (match) {
            const originalName = match[1] + match[2];
            if (allFiles.includes(originalName)) {
                return; // Skip duplicate
            }
        }
        uniqueFiles.push(file);
    });
    
    // Use ALL unique images instead of limiting to 12
    let galleryHtml = '';
    for (let i = 0; i < uniqueFiles.length; i++) {
        let delay = (i % 3) * 200;
        galleryHtml += `
                <div class="col-md-4 col-sm-6" data-aos="zoom-in" data-aos-delay="${delay}">
                    <img src="assets/RR2.photos/new/${imgDir}/${uniqueFiles[i]}" alt="Highlight ${i+1}" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 250px;">
                </div>`;
    }
    
    // Replace gallery section
    content = content.replace(/<div class="row g-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, '<div class="row g-4">' + galleryHtml + '\n            </div>\n        </div>\n    </section>');
    
    fs.writeFileSync(fullPath, content);
}

// Update the affected files
updateGallery('project-paw.html', 'paw');
updateGallery('project-ziadraphael.html', 'ZIAD RAPHAEL');
updateGallery('project-oman.html', 'oman');
updateGallery('project-sintra-big5.html', 'sintra');

console.log('Galleries updated to include ALL unique images.');
