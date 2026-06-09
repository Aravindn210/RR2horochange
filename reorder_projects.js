const fs = require('fs');

const file = 'd:/RR2/heroscetionchnage/RR2website-main/works.html';
let content = fs.readFileSync(file, 'utf8');

// Extract the grid content
const gridStartMatch = content.match(/<div class="row g-4">/);
const gridStartIndex = gridStartMatch.index + gridStartMatch[0].length;
const gridEndIndex = content.indexOf('</div>\n            <div class="text-center mt-5">'); // Or similar closing of row g-4.
// Let's find exactly the close of the row g-4
const gridContentMatch = content.match(/<div class="row g-4">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);

if (!gridContentMatch) {
    console.error('Could not find grid');
    process.exit(1);
}

const gridContent = gridContentMatch[1];
const projectBlocks = [];
const regex = /<div class="col-md-4"[\s\S]*?<\/a>\s*<\/div>/g;
let match;
while ((match = regex.exec(gridContent)) !== null) {
    const blockHtml = match[0];
    const titleMatch = blockHtml.match(/<h4>(.*?)<\/h4>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
    projectBlocks.push({ title, html: blockHtml });
}

// Desired order based on user request
const desiredOrder = [
    'Government of Sharjah - Economic Development Department',
    'Wasl Experience Center',
    'Ziad Raphael Nassar Weddings (Setup)',
    'Le Mariage Weddings',
    'Ziad Raphael Nassar Weddings',
    'The Ripe Market, Academy Park',
    'Sesame Street Mall Activation',
    'Sintra - BIG 5 2025',
    'Paw Patrol - Brand Activation',
    'Batman - Abu Dhabi International Bookfair',
    'Celebrate Every Story in Muscat Night',
    'Smart Powers - Gulfood 2026',
    'Soul Beach Club Custom Build'
];

const sortedBlocks = [];
const usedIndexes = new Set();

// 1. Add blocks according to desired order
for (const desiredTitle of desiredOrder) {
    const index = projectBlocks.findIndex((p, i) => !usedIndexes.has(i) && (p.title.toLowerCase().includes(desiredTitle.toLowerCase()) || desiredTitle.toLowerCase().includes(p.title.toLowerCase())));
    if (index !== -1) {
        sortedBlocks.push(projectBlocks[index]);
        usedIndexes.add(index);
    }
}

// 2. Add remaining blocks
for (let i = 0; i < projectBlocks.length; i++) {
    if (!usedIndexes.has(i)) {
        sortedBlocks.push(projectBlocks[i]);
    }
}

// Reassign data-aos-delay to keep the animation pattern correct (0, 50, 100, 0, 50, 100...)
let finalHtml = '';
const delays = ['0', '50', '100'];
const animations = ['flip-up', 'flip-right', 'flip-left'];
for (let i = 0; i < sortedBlocks.length; i++) {
    let block = sortedBlocks[i].html;
    // Replace data-aos-delay and data-aos to be consistent
    block = block.replace(/data-aos=".*?"/, `data-aos="${animations[i % 3]}"`);
    block = block.replace(/data-aos-delay=".*?"/, `data-aos-delay="${delays[i % 3]}"`);
    finalHtml += '\n' + block;
}

// Replace the original grid content
const newContent = content.replace(gridContentMatch[1], finalHtml + '\n            ');

fs.writeFileSync(file, newContent);
console.log('Successfully reordered projects in works.html');
