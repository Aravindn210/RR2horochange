const fs = require('fs');

const file = 'd:/RR2/heroscetionchnage/RR2website-main/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the first recent project (Batman) with the Oman project
content = content.replace(
    /<div class="work-minimal-item" data-aos="fade-up" data-aos-delay="0">\s*<a href="project-batman\.html"[\s\S]*?<\/div>\s*<\/a>\s*<\/div>/,
    `<div class="work-minimal-item" data-aos="fade-up" data-aos-delay="0">
                    <a href="project-oman.html" class="text-decoration-none">
                        <div class="work-minimal-image">
                            <img src="assets/RR2.photos/new/oman/648706222_17878051899504598_5396926748252637363_n.webp" alt="Celebrate Every Story">
                            <div class="work-minimal-overlay">
                                <span class="work-num">01</span>
                                <div class="work-minimal-info">
                                    <h3>Celebrate Every Story in Muscat Night</h3>
                                    <p>Brand Activation</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`
);

fs.writeFileSync(file, content);
console.log('Updated index.html to include Oman project in recent works.');
