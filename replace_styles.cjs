const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        
        content = content.replace(/background:\s*#121212;/g, 'background: #111111;');
        content = content.replace(/border:\s*2px solid #1E1E1E;/g, 'border: none;');
        content = content.replace(/border:\s*1px solid #1E1E1E;/g, 'border: none;');
        content = content.replace(/border-bottom:\s*1px solid #1E1E1E;/g, 'border-bottom: 1px solid #1A1A1A;');
        content = content.replace(/border-bottom:\s*2px solid #1E1E1E;/g, 'border-bottom: 1px solid #1A1A1A;');
        content = content.replace(/border-top:\s*1px solid #1E1E1E;/g, 'border-top: 1px solid #1A1A1A;');
        content = content.replace(/border-top:\s*2px solid #1E1E1E;/g, 'border-top: 1px solid #1A1A1A;');
        content = content.replace(/box-shadow:\s*0 4px 0px #248A3D;/g, 'box-shadow: none;');
        content = content.replace(/box-shadow:\s*0 4px 0px #B91C1C;/g, 'box-shadow: none;');
        content = content.replace(/background:\s*#1E1E1E;/g, 'background: #1A1A1A;');
        
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
