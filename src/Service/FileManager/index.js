var https = require('https');
var fs = require('fs');

// var download = async function(url, dest, cb) {
//     var file = await fs.createWriteStream(dest);
//     await https.get(url, async function(response) {
//         await response.pipe(file);
//         await file.on('finish', async function() {
//             await file.close(cb);
//         });
//     });
// }
var download = (url,dest) => {
    return new Promise((resolve,reject)=>{
        var file = fs.createWriteStream(dest);
        https.get(url, async function(response) {
            response.pipe(file);
            file.on('finish', async function() {
                file.close((err) => { 
                    if (err) 
                        console.error('Failed to close file', err);
                    else { 
                        console.log("\n> File Closed successfully"); 
                        resolve('Download terminado');
                    } 
                });
            });
        });
    });
}
module.exports = {
    download
}
// const main = async ()=>{
//     await download('https://speed.hetzner.de/100MB.bin','./100MB.bin');
// }
// main();