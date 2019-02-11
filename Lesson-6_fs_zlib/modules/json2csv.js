const fs = require('fs');
const path = require('path');

class Json2csv {
    constructor(options = { filter: [] }) {
        this.outFileName = 'data.csv';
        this.options = options;
    }

    convert(fileName) {
        fs.readFile(path.join(__dirname, '../data', fileName), 'utf-8', (error, inJSON) => {
            if (error) {
                console.error(error.name, error.message);
            } else {
                if (!inJSON) {
                    console.log('No data to convert');
                }

                const array = JSON.parse(inJSON);

                let outCSV
                    = Object.keys(array[ 0 ])
                        .map((value) => `"${value}"`)
                        .join(',') + '\n';

                array.reduce((_previous, current) => {
                    outCSV
                        += Object.values(current)
                            .map((value) => `"${value}"`)
                            .join(',') + '\n';

                    return outCSV;
                });

                fs.writeFile(path.join(__dirname, '../data', this.outFileName), outCSV, (error) => {
                    if (error) {
                        return console.error(error.name, error.message);
                    }
                    console.log('File written!');
                });
            }
        });
    }
}

module.exports = Json2csv;
