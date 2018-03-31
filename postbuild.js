const fs = require('fs')
try{
    const contents = fs.readFileSync('custom-event.js', 'utf8');
    const lines = contents.split('\n');
    const newLines = [];
    lines.forEach(line =>{
        if(line.trimLeft().startsWith('import ')) return;
        newLines.push(line);
    })
    let newContent = `
(function () {
${newLines.join('\n')}
})();  
    `;
    console.log(newContent);

}catch(err){
    console.error(err);
}

