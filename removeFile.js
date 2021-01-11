const fs = require('fs');
async function removeFile(dest) {
    try {
        await fs.unlinkSync(dest);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    removeFile
}