const fs = require('fs');

const file = 'd:/RR2/heroscetionchnage/RR2website-main/works.html';
let content = fs.readFileSync(file, 'utf8');

const newProjects = `
                <!-- Oman Project -->
                <div class="col-md-4" data-aos="flip-up" data-aos-delay="0">
                    <a href="project-oman.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="assets/RR2.photos/new/oman/648706222_17878051899504598_5396926748252637363_n.webp" alt="Celebrate Every Story in Muscat Night"
                                class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Celebrate Every Story in Muscat Night</h4>
                                <p>Brand Activation (Eventbox)</p>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- Ziad Raphael Project -->
                <div class="col-md-4" data-aos="flip-right" data-aos-delay="50">
                    <a href="project-ziadraphael.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="assets/RR2.photos/new/ZIAD RAPHAEL/649848290_17878951017504598_7219623461530352594_n.webp" alt="Ziad Raphael Project"
                                class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Ziad Raphael Project</h4>
                                <p>Project Portfolio</p>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- Paw Project -->
                <div class="col-md-4" data-aos="flip-left" data-aos-delay="100">
                    <a href="project-paw.html" class="text-decoration-none">
                        <div class="work-item">
                            <img src="assets/RR2.photos/new/paw/649236953_17878659603504598_7778931073868002730_n.webp" alt="Paw Project"
                                class="img-fluid rounded-4 object-fit-cover w-100" style="height: 350px;">
                            <div class="work-overlay">
                                <h4>Paw Project</h4>
                                <p>Brand Experience</p>
                            </div>
                        </div>
                    </a>
                </div>`;

// Insert the new projects into the beginning of the grid
content = content.replace('<div class="row g-4">', '<div class="row g-4">' + newProjects);

fs.writeFileSync(file, content);
console.log('Added 3 new projects to works.html');
