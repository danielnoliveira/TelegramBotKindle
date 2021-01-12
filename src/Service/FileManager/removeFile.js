const fs = require('fs');
async function remove(dest) {
    try {
        await fs.unlinkSync(dest);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    remove
}