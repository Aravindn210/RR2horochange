const fs = require('fs');

function updateProjectInfo(filename, data) {
    const file = `d:/RR2/heroscetionchnage/RR2website-main/${filename}`;
    let content = fs.readFileSync(file, 'utf8');

    // Update <title>
    content = content.replace(/<title>.*?<\/title>/, `<title>RR2Global | ${data.title}</title>`);
    
    // Update <h1>
    content = content.replace(/<h1 class="display-[1-3] fw-bold.*?">.*?<\/h1>/, `<h1 class="display-3 fw-bold text-uppercase">${data.h1Main} <span class="text-gradient-hero">${data.h1Gradient}</span></h1>`);
    
    // Update lead paragraph
    content = content.replace(/<p class="lead mt-3">.*?<\/p>/, `<p class="lead mt-3">${data.subtitle}</p>`);

    // In project-xxxx.html there might be a Project Brief section, but we don't know its exact structure reliably.
    // The main titles and subtitles are enough based on the user's request.

    fs.writeFileSync(file, content);
}

// 1. Paw
updateProjectInfo('project-paw.html', {
    title: 'PAW PATROL - Brand Activation',
    h1Main: 'PAW PATROL -',
    h1Gradient: 'BRAND ACTIVATION',
    subtitle: 'Dubai Festival City Mall | Eventbox'
});

// 2. Ziad Raphael
updateProjectInfo('project-ziadraphael.html', {
    title: 'Ziad Raphael Nassar Weddings',
    h1Main: 'ZIAD RAPHAEL NASSAR',
    h1Gradient: 'WEDDINGS',
    subtitle: 'Royal Wedding | Riyadh, Saudi Arabia'
});

// 3. Wasl Experience Center
updateProjectInfo('project-wasl.html', {
    title: 'Wasl Avenue Park Towers',
    h1Main: 'WASL AVENUE PARK TOWERS',
    h1Gradient: 'LAUNCH EVENT',
    subtitle: 'Corporate Event | Wasl Experience Center | The Name Agency'
});

// 4. Ziad Raphael 2
updateProjectInfo('project-ziadraphael2.html', {
    title: 'Ziad Raphael Nassar Weddings (Setup)',
    h1Main: 'ZIAD RAPHAEL NASSAR',
    h1Gradient: 'WEDDINGS SETUP',
    subtitle: 'Royal Wedding | Riyadh, Saudi Arabia'
});


// Also update the names in works.html
let worksFile = 'd:/RR2/heroscetionchnage/RR2website-main/works.html';
let worksContent = fs.readFileSync(worksFile, 'utf8');

worksContent = worksContent.replace(/<h4>Ziad Raphael Project<\/h4>\s*<p>Project Portfolio<\/p>/g, '<h4>Ziad Raphael Nassar Weddings</h4>\n                                <p>Royal Wedding</p>');
worksContent = worksContent.replace(/<h4>Paw Project<\/h4>\s*<p>Brand Experience<\/p>/g, '<h4>Paw Patrol - Brand Activation</h4>\n                                <p>Dubai Festival City Mall</p>');
worksContent = worksContent.replace(/<h4>Wasl Experience Center<\/h4>\s*<p>Brand Experience<\/p>/g, '<h4>Wasl Avenue Park Towers</h4>\n                                <p>Launch Event</p>');
worksContent = worksContent.replace(/<h4>Ziad Raphael 2 Project<\/h4>\s*<p>Project Portfolio<\/p>/g, '<h4>Ziad Raphael Nassar Weddings (Setup)</h4>\n                                <p>Royal Wedding</p>');

fs.writeFileSync(worksFile, worksContent);
console.log('Project names updated based on images.');
