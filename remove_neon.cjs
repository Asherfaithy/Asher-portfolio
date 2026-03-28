const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Remove neon shadow effects globally
css = css.replace(/^\s*text-shadow:.*?;[\r\n]+/gm, '');
css = css.replace(/^\s*box-shadow:.*?;[\r\n]+/gm, '');

fs.writeFileSync(cssPath, css);
console.log('Removed all text-shadow and box-shadow variables from index.css to eliminate neon elements.');
