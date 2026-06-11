const fs = require('fs');
const path = require('path');

const WORK_DIR = __dirname;
const IGNORE_DIRS = ['node_modules', '.git', '.github', '.vscode', '.agents'];
const CODE_EXTENSIONS = ['.html', '.css', '.js'];

// Find all code files
function findCodeFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                results = results.concat(findCodeFiles(fullPath));
            }
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (CODE_EXTENSIONS.includes(ext) && file !== 'update_references.js' && file !== 'convert_to_webp.js') {
                results.push(fullPath);
            }
        }
    });
    return results;
}

function run() {
    console.log("Starting Reference Update to WebP...");
    const files = findCodeFiles(WORK_DIR);
    console.log(`Found ${files.length} code files to scan.`);

    let totalReplacements = 0;

    for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Regex to match .png, .jpg, .jpeg case-insensitively
        const regex = /\.(png|jpg|jpeg)\b/gi;
        
        const matches = content.match(regex);
        if (matches) {
            const updatedContent = content.replace(regex, '.webp');
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`[Updated] ${path.relative(WORK_DIR, filePath)}: replaced ${matches.length} image reference(s).`);
            totalReplacements += matches.length;
        }
    }

    console.log(`Reference updates complete! Total replacements: ${totalReplacements}`);
}

run();
