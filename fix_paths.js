const fs = require('fs');
const path = require('path');

const dir = 'd:/RR2/heroscetionchnage/RR2website-main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace absolute paths with relative paths
    content = content.replace(/href="\/css\//g, 'href="css/');
    content = content.replace(/src="\/js\//g, 'src="js/');
    content = content.replace(/src="\/assets\//g, 'src="assets/');
    content = content.replace(/href="\/assets\//g, 'href="assets/');
    content = content.replace(/data-include="\/navbar\.html"/g, 'data-include="navbar.html"');
    content = content.replace(/data-include="\/footer\.html"/g, 'data-include="footer.html"');
    content = content.replace(/href="\/(about|index|news|works|contact|get-quote|services|branding|design|events|exhibitions|interiors|project-[a-zA-Z0-9-]+)\.html"/g, 'href="$1.html"');
    
    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Fixed absolute paths to relative paths in ' + files.length + ' HTML files.');
