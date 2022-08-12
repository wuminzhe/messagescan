var fs = require('fs');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const mkdir = path => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

const writeFile = (path, content) => {
    fs.writeFile(path, content, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}

exports.sleep = sleep
exports.mkdir = mkdir
exports.writeFile = writeFile