const fs = require('fs')
function processFile(filePath, newLines){
    const contents = fs.readFileSync(filePath, 'utf8');
    const lines = contents.split('\n');
    lines.forEach(line =>{
        const tl = line.trimLeft();
        if(tl.startsWith('import ')) return;
        if(tl.startsWith('export ')){
            newLines.push(line.replace('export '), '');
        }else{
            newLines.push(line);
        }
        
    })
}
const newLines = [];
processFile('custom-event.js', newLines);
processFile('obser-attributes.js', newLines);
let newContent = `
(function () {
${newLines.join('\n')}
})();  
    `;
console.log(newContent);



