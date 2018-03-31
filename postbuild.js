const fs = require('fs')
try{
    const contents = fs.readFileSync('custom-event.js', 'utf8');
    console.log(contents);

}catch(err){
    console.error(err);
}
