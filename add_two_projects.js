const fs = require('fs');
const path = require('path');

const baseDir = 'd:/RR2/heroscetionchnage/RR2website-main';

// 1. Create HTML files based on a template (using project-batman as clean template)
const template = fs.readFileSync(path.join(baseDir, 'project-batman.html'), 'utf8');

function createProjectPage(filename, title, imgDir) {
    let content = template.replace(/<title>.*?<\/title>/, `<title>RR2Global | ${title}</title>`);
    content = content.replace(/<h1 class="display-1 fw-bold">.*?<\/h1>/, `<h1 class="display-1 fw-bold">${title.toUpperCase()} <span class="text-gradient-hero">PROJECT</span></h1>`);
    content = content.replace(/Batman - Abu Dhabi International Bookfair/g, title);
    
    // Read unique images
    const dirPath = path.join(baseDir, 'assets/RR2.photos/new', imgDir);
    let allFiles = fs.readdirSync(dirPath).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i));
    
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

    // Replace main hero image
    if (uniqueFiles.length > 0) {
        content = content.replace(/src="assets\/RR2\.photos\/BATMAN\/14\.png"/g, `src="assets/RR2.photos/new/${imgDir}/${uniqueFiles[0]}"`);
    }

    // Build gallery
    let galleryHtml = '';
    for (let i = 0; i < uniqueFiles.length; i++) {
        let delay = (i % 3) * 200;
        galleryHtml += `
                <div class="col-md-4 col-sm-6" data-aos="zoom-in" data-aos-delay="${delay}">
                    <img src="assets/RR2.photos/new/${imgDir}/${uniqueFiles[i]}" alt="Highlight ${i+1}" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 250px;">
                </div>`;
    }
    
    content = content.replace(/<div class="row g-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, '<div class="row g-4">' + galleryHtml + '\n            </div>\n        </div>\n    </section>');

    fs.writeFileSync(path.join(baseDir, filename), content);
    
    return uniqueFiles[0]; // return first image for works.html
}

const waslImg = createProjectPage('project-wasl.html', 'Wasl Experience Center', 'Wasl Experience Center');
const zr2Img = createProjectPage('project-ziadraphael2.html', 'Ziad Raphael 2', 'ZIAD RAPHAEL 2');

// 2. Add to works.html
let worksContent = fs.readFileSync(path.join(baseDir, 'works.html'), 'utf8');

const newWorks = `
                <!-- Wasl Experience Center -->
                <div class="col-md-4" data-aos="flip-up" data-aos-delay="0">
                    <a href="project-wasl.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="assets/RR2.photos/new/Wasl Experience Center/${waslImg}" alt="Wasl Experience Center"
                                class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Wasl Experience Center</h4>
                                <p>Brand Experience</p>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- Ziad Raphael 2 -->
                <div class="col-md-4" data-aos="flip-right" data-aos-delay="50">
                    <a href="project-ziadraphael2.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="assets/RR2.photos/new/ZIAD RAPHAEL 2/${zr2Img}" alt="Ziad Raphael 2 Project"
                                class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Ziad Raphael 2 Project</h4>
                                <p>Project Portfolio</p>
                            </div>
                        </div>
                    </a>
                </div>`;

worksContent = worksContent.replace('<div class="row g-4">', '<div class="row g-4">' + newWorks);
fs.writeFileSync(path.join(baseDir, 'works.html'), worksContent);

console.log('Successfully created new project pages and updated works.html');
