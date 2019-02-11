const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class Archiver {
    zip(fileName, options) {
        const algorithm = options.algorithm === 'gzip' ? zlib.createGzip() : zlib.createDeflate();
        const r = fs.createReadStream(path.join(__dirname, '../data', fileName));
        const w = fs.createWriteStream(path.join(__dirname, '../data', 'comments.json.gz'));

        r.pipe(algorithm)
            // .on('error', ({ name, message }) => {
            //     console.error(`→ ${name} ${message}`);
            //     process.exit(1);
            // })
            .pipe(w);
        // .on('error', ({ name, message }) => {
        //     console.error(`→ ${name} ${message}`);
        //     process.exit(1);
        // });
    }

    unzip(fileName) {
        const r = fs.createReadStream(path.join(__dirname, '../data', fileName));
        const w = fs.createWriteStream(path.join(__dirname, '../data', 'commentsUnzipped.json'));

        r.pipe(zlib.createUnzip())
            // .on('error', ({ name, message }) => {
            //     console.error(`→ ${name} ${message}`);
            //     process.exit(1);
            // })
            .pipe(w);
        // .on('error', ({ name, message }) => {
        //     console.error(`→ ${name} ${message}`);
        //     process.exit(1);
        // });
    }
}
module.exports = Archiver;
