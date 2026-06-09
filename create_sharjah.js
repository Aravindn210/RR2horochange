const fs = require('fs');

const images = [
    "669057212_17883527775504598_3331645433675572753_n (1).webp",
    "669430893_17883527730504598_1725840406689734062_n (1).webp",
    "669692345_17883527673504598_5379798247628207130_n (1).webp",
    "669704263_17883527655504598_1022972908662332172_n (1).webp",
    "669782498_17883527691504598_1382380244041860277_n (1).webp",
    "669791193_17883527712504598_7553819075532040010_n (1).webp",
    "669913056_17883527664504598_864135577183901213_n (1).webp",
    "670288761_17883527721504598_7342581374837909942_n (1).webp",
    "670811179_17883527745504598_5404486839008581432_n (1).webp",
    "671122786_17883527682504598_2758674098849192644_n (1).webp",
    "671192975_17883527754504598_2713254173617139243_n (1).webp"
];

const basePath = "assets/RR2.photos/new/ounce event/";
const coverImage = basePath + images[1];

let galleryHtml = '';
const delays = [0, 200, 400];
images.forEach((img, index) => {
    galleryHtml += `
                <div class="col-md-4 col-sm-6" data-aos="zoom-in" data-aos-delay="${delays[index % 3]}">
                    <img src="${basePath + img}" alt="Highlight ${index + 1}" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 250px;">
                </div>`;
});

// Read sintra for standard preloader template
let template = fs.readFileSync('project-sintra.html', 'utf8');

// Replace titles
template = template.replace(/<title>.*?<\/title>/, `<title>RR2Global | Government of Sharjah - Economic Development Department</title>`);
template = template.replace(/<h1 class="display-3 fw-bold text-uppercase">.*?<\/h1>/, `<h1 class="display-3 fw-bold text-uppercase">GOVERNMENT OF SHARJAH - <span class="text-gradient-hero">ECONOMIC DEVELOPMENT DEPARTMENT</span></h1>`);
template = template.replace(/<p class="lead mt-3">.*?<\/p>/, `<p class="lead mt-3">Corporate Event | Ounce | Al-Jawaher Reception and Convention Center</p>`);

// Replace hero image
template = template.replace(/<img src="assets\/RR2.photos\/SINTRA\/[a-zA-Z0-9_\-\.]+"/, `<img src="${coverImage}"`);

// Replace Project Brief
template = template.replace(/<span class="fw-bold">SINTRA MIDDLE EAST<\/span>/, `<span class="fw-bold">OUNCE</span>`);
template = template.replace(/<span class="fw-bold">Exhibition Stand<\/span>/, `<span class="fw-bold">Corporate Event</span>`);
template = template.replace(/<span class="fw-bold">Dubai World Trade Center<\/span>/, `<span class="fw-bold">Al-Jawaher Reception and Convention Center</span>`);

// Replace gallery
const galleryStart = template.indexOf('<div class="row g-4">');
const galleryEnd = template.indexOf('</div>', template.indexOf('</div>', template.lastIndexOf('assets/RR2.photos/SINTRA/')) + 10);
// Safer to just replace the inner contents of <div class="row g-4">
const rowG4Regex = /<div class="row g-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
template = template.replace(rowG4Regex, `<div class="row g-4">${galleryHtml}\n            </div>\n        </div>\n    </section>`);

// Write the file
fs.writeFileSync('project-sharjah.html', template);
console.log('Created project-sharjah.html');

// Add to works.html
let worksContent = fs.readFileSync('works.html', 'utf8');
const newBlock = `
                <div class="col-md-4" data-aos="flip-up" data-aos-delay="0">
                    <a href="project-sharjah.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="${coverImage}"
                                alt="Government of Sharjah" class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Government of Sharjah - Economic Development Department</h4>
                                <p>Corporate Event</p>
                            </div>
                        </div>
                    </a>
                </div>`;

const worksRegex = /<div class="row g-4">/;
worksContent = worksContent.replace(worksRegex, `<div class="row g-4">${newBlock}`);
fs.writeFileSync('works.html', worksContent);
console.log('Added to works.html');

// Add to index.html (works grid)
let indexContent = fs.readFileSync('index.html', 'utf8');
const newIndexBlock = `
                <div class="work-minimal-item" data-aos="fade-up" data-aos-delay="100">
                    <a href="project-sharjah.html" class="text-decoration-none">
                        <div class="work-minimal-image">
                            <img src="${coverImage}" alt="Government of Sharjah">
                            <div class="work-minimal-overlay">
                                <span class="work-num">01</span>
                                <div class="work-minimal-info">
                                    <h3>Government of Sharjah</h3>
                                    <p>Corporate Event (Ounce)</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;

// Insert after the first item in index.html (or before)
const indexRegex = /<div class="work-minimal-grid">/;
indexContent = indexContent.replace(indexRegex, `<div class="work-minimal-grid">${newIndexBlock}`);
fs.writeFileSync('index.html', indexContent);
console.log('Added to index.html');
