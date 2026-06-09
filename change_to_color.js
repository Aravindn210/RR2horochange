const fs = require('fs');

const replacements = [
    {
        name: 'MBRF',
        projectFile: 'project-ounce.html',
        oldSrc: 'assets/RR2.photos/OUNCE/2.png',
        newSrc: 'assets/RR2.photos/OUNCE/3.png',
        worksTitleRegex: /<h4>MBR Al Maktoum Knowledge Foundation<\/h4>/
    },
    {
        name: 'Sintra',
        projectFile: 'project-sintra.html',
        oldSrc: 'assets/RR2.photos/SINTRA/2.png',
        newSrc: 'assets/RR2.photos/SINTRA/4.png',
        worksTitleRegex: /<h4>Sintra Luxury Living<\/h4>/
    },
    {
        name: 'Ziad2',
        projectFile: 'project-ziadraphael2.html',
        oldSrc: 'assets/RR2.photos/new/ZIAD RAPHAEL 2/650024218_17879068527504598_220139564360763018_n.webp',
        newSrc: 'assets/RR2.photos/new/ZIAD RAPHAEL 2/650473265_17879068491504598_6775905982729984921_n.webp',
        worksTitleRegex: /<h4>Ziad Raphael Nassar Weddings \(Setup\)<\/h4>/
    },
    {
        name: 'Paw',
        projectFile: 'project-paw.html',
        oldSrc: 'assets/RR2.photos/new/paw/649242796_17878659549504598_2068690630131248865_n.webp',
        newSrc: 'assets/RR2.photos/new/paw/649270682_17878659630504598_1066584352453568339_n.webp',
        worksTitleRegex: /<h4>Paw Patrol - Brand Activation<\/h4>/
    }
];

// Update works.html
let worksContent = fs.readFileSync('works.html', 'utf8');

const regex = /<div class="col-md-4"[\s\S]*?<\/a>\s*<\/div>/g;
let worksMatch;
let modifiedWorksContent = worksContent;

while ((worksMatch = regex.exec(worksContent)) !== null) {
    const blockHtml = worksMatch[0];
    
    for (const rep of replacements) {
        if (rep.worksTitleRegex.test(blockHtml)) {
            // Replace the image source ONLY within this block
            const newBlockHtml = blockHtml.replace(rep.oldSrc, rep.newSrc);
            modifiedWorksContent = modifiedWorksContent.replace(blockHtml, newBlockHtml);
            console.log(`Replaced cover for ${rep.name} in works.html`);
        }
    }
}
fs.writeFileSync('works.html', modifiedWorksContent);


// Update individual project files (Hero Image only)
for (const rep of replacements) {
    if (fs.existsSync(rep.projectFile)) {
        let projContent = fs.readFileSync(rep.projectFile, 'utf8');
        // Replace only the main hero image
        const firstIndex = projContent.indexOf(rep.oldSrc);
        if (firstIndex !== -1) {
            projContent = projContent.substring(0, firstIndex) + rep.newSrc + projContent.substring(firstIndex + rep.oldSrc.length);
            fs.writeFileSync(rep.projectFile, projContent);
            console.log(`Replaced hero image for ${rep.name} in ${rep.projectFile}`);
        } else {
            console.log(`Could not find old hero image in ${rep.projectFile}`);
        }
    } else {
        console.log(`Project file ${rep.projectFile} does not exist.`);
    }
}
