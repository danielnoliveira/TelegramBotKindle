var https = require('https');
var fs = require('fs');

var download = async function(url, dest, cb) {
    var file = await fs.createWriteStream(dest);
    await https.get(url, async function(response) {
        await response.pipe(file);
        await file.on('finish', async function() {
            await file.close(cb);
        });
    });
}

module.exports = {
    download
}