const fs = require('fs');
const path = require('path');

class Json2csv {
    constructor(options = { fields: false }) {
        this.outFileName = 'data.csv';
        this.options = options;
    }

    convert(fileName) {
        //Read JSON file
        fs.readFile(path.join(__dirname, '../data', fileName), 'utf-8', (error, inJSON) => {
            if (error) {
                console.error(error.name, error.message);
            } else {
                const array = JSON.parse(inJSON);

                const header = Object.keys(array[ 0 ]);
                // Converting parameters
                const fields = this.options.fields;
                let allowedColumns = header;
                if (fields) {
                    allowedColumns = header.filter((value) => fields.includes(value));
                }
                // CSV header
                let outCSV = allowedColumns.map((value) => `"${value}"`).join(';') + '\n';
                // CSV body
                array.reduce((_previous, current) => {
                    const filteredObj = Object.keys(current)
                        .filter((key) => allowedColumns.includes(key))
                        .reduce((obj, key) => {
                            obj[ key ] = current[ key ];

                            return obj;
                        }, {});

                    const filteredArr = Object.values(filteredObj).map((value) => `"${value}"`);

                    outCSV += filteredArr.join(';') + '\n';

                    return outCSV;
                }, outCSV);

                //Write CSV file
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
