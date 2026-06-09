const fs = require('fs');
const path = require('path');

const dir = 'd:/RR2/heroscetionchnage/RR2website-main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Add cache buster to css/style.css and css/overlay_updates.css
    content = content.replace(/href="css\/style\.css(\?v=\d+)?"/g, 'href="css/style.css?v=' + Date.now() + '"');
    content = content.replace(/href="css\/overlay_updates\.css(\?v=\d+)?"/g, 'href="css/overlay_updates.css?v=' + Date.now() + '"');
    
    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Cache buster added to CSS links in ' + files.length + ' HTML files.');
