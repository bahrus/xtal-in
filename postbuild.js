const fs = require('fs')
try{
    fs.readFileSync('custom-event.js', 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ');
        console.log(data)
      });

}catch(err){
    console.error(err);
}
