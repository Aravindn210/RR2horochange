const fs = require('fs');

const index = fs.readFileSync('d:/RR2/heroscetionchnage/RR2website-main/index.html', 'utf8');

// Extract the preloader style from index.html
const indexStyleMatch = index.match(/<style>([\s\S]*?)<\/style>/);
const standardStyle = indexStyleMatch ? `<style>\n${indexStyleMatch[1]}\n    </style>` : '';

// Extract the preloader HTML from index.html
const indexPreloaderMatch = index.match(/<div id="preloader">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
const standardPreloader = indexPreloaderMatch ? indexPreloaderMatch[0] : `    <div id="preloader">
        <div class="preloader-bg"></div>
        <div class="loader-wrapper">
            <div class="morphing-blob"></div>
            <div class="loader-logo-container w-100 px-4 text-center">
                <img src="assets/we%20dont%20do%20ordinary-01.png" alt="WE DON'T DO ORDINARY" class="loader-wow-img">
            </div>
        </div>
    </div>`;

function fixPreloader(filename) {
    const file = `d:/RR2/heroscetionchnage/RR2website-main/${filename}`;
    let content = fs.readFileSync(file, 'utf8');

    // Replace <style> block
    content = content.replace(/<style>[\s\S]*?<\/style>/, standardStyle);

    // Replace <div id="preloader"> block
    // Since batman has different internal structure, match it specifically or match the known block
    content = content.replace(/<div id="preloader">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, standardPreloader);

    fs.writeFileSync(file, content);
}

fixPreloader('project-wasl.html');
fixPreloader('project-ziadraphael2.html');

console.log('Fixed preloaders to use standard blob instead of Batman.');
