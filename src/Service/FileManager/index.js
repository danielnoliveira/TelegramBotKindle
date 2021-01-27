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
                    if (err){ 
                        console.error('Failed to close file', err);
                        reject('fail');
                    }else { 
                        console.log("\n> File Closed successfully"); 
                        resolve('success');
                    } 
                });
            });
        });
    });
}
var removeFile = async (file_path) => {
    try {
        await fs.unlinkSync(file_path);
        console.log('File removed successfully');
        return 'success';
    } catch(err) {
        console.error(err);
        return 'fail';
    }
}
module.exports = {
    download,
    removeFile,
}
// const main = async ()=>{
//     await download('https://speed.hetzner.de/100MB.bin','./100MB.bin');
// }
// main();