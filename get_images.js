const fs = require('fs');
const content = fs.readFileSync('works.html', 'utf8');

const regex = /<div class="col-md-4"[\s\S]*?<\/a>\s*<\/div>/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const html = match[0];
    if (html.toLowerCase().includes('maktoum')) {
        console.log('MBRF:', html.match(/src="(.*?)"/)[1]);
    }
    if (html.toLowerCase().includes('sintra')) {
        console.log('Sintra:', html.match(/src="(.*?)"/)[1]);
    }
    if (html.toLowerCase().includes('paw patrol')) {
        console.log('Paw:', html.match(/src="(.*?)"/)[1]);
    }
    if (html.toLowerCase().includes('ziad raphael nassar weddings (setup)')) {
        console.log('Ziad2:', html.match(/src="(.*?)"/)[1]);
    }
}
