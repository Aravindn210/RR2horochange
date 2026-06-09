const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

// Fix body and html background
css = css.replace('background: #000000;', 'background: #000000 !important;');
css = css.replace('html {\r\n    margin: 0;\r\n    padding: 0;\r\n}', 'html {\r\n    margin: 0;\r\n    padding: 0;\r\n    background-color: #000000 !important;\r\n}');
css = css.replace('html {\n    margin: 0;\n    padding: 0;\n}', 'html {\n    margin: 0;\n    padding: 0;\n    background-color: #000000 !important;\n}');

// Add a:visited fix at the top (after body)
if (!css.includes('a:visited {')) {
    css = css.replace('html {', 'a {\r\n    text-decoration: none;\r\n}\r\n\r\na:visited {\r\n    color: inherit;\r\n}\r\n\r\nhtml {');
}

// Fix pill-nav-links visited colors
css = css.replace('.pill-nav-links a {', '.pill-nav-links a,\n.pill-nav-links a:visited {');
css = css.replace('color: rgba(255, 255, 255, 0.7);', 'color: rgba(255, 255, 255, 0.7) !important;');
css = css.replace('.pill-nav-links a.active {', '.pill-nav-links a.active,\n.pill-nav-links a.active:visited {');
css = css.replace('.pill-nav-links a:hover {', '.pill-nav-links a:hover,\n.pill-nav-links a:hover:visited {');

// Fix btn-pill-quote visited color
css = css.replace('.btn-pill-quote {', '.btn-pill-quote,\n.btn-pill-quote:visited {');

// Add global visited overrides at the bottom
const visitedOverrides = `
/* Prevent browser visited purple tint globally across all key link types */
.footer-links a:visited,
.text-white-50:visited {
    color: rgba(255, 255, 255, 0.5) !important;
}

.social-icon:visited {
    color: var(--aqua-primary) !important;
}

.floating-side-actions a:visited {
    color: #fff !important;
}
`;

if (!css.includes('.footer-links a:visited')) {
    css += '\n' + visitedOverrides;
}

fs.writeFileSync('css/style.css', css);
console.log('Fixed style.css for background and visited links.');
