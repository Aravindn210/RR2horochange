const fs = require('fs');

function updateFile(filename, imgDir, titlePlaceholder) {
    let content = fs.readFileSync(filename, 'utf8');
    const files = fs.readdirSync('assets/RR2.photos/new/' + imgDir).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
    
    // Update the main image
    content = content.replace(/src="assets\/RR2\.photos\/EVENTBOX\/1\.png"/g, 'src="assets/RR2.photos/new/' + imgDir + '/' + files[0] + '"');
    
    // Create new gallery
    let galleryHtml = '';
    for (let i = 0; i < Math.min(files.length, 12); i++) {
        let delay = (i % 3) * 200;
        galleryHtml += `
                <div class="col-md-4 col-sm-6" data-aos="zoom-in" data-aos-delay="${delay}">
                    <img src="assets/RR2.photos/new/${imgDir}/${files[i]}" alt="Highlight ${i+1}" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 250px;">
                </div>`;
    }
    
    // Replace gallery section
    content = content.replace(/<div class="row g-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, '<div class="row g-4">' + galleryHtml + '\n            </div>\n        </div>\n    </section>');
    
    // Update title placeholder
    content = content.replace(/<h1 class="display-1 fw-bold">CARTOON NETWORK <span class="text-gradient-hero">ACTIVATION<\/span><\/h1>/, '<h1 class="display-1 fw-bold">' + titlePlaceholder + '</h1>');
    
    fs.writeFileSync(filename, content);
}

updateFile('project-paw.html', 'paw', 'PAW <span class="text-gradient-hero">PROJECT</span>');
updateFile('project-ziadraphael.html', 'ZIAD RAPHAEL', 'ZIAD RAPHAEL <span class="text-gradient-hero">PROJECT</span>');
console.log('Files updated successfully.');
