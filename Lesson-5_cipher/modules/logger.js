const { Transform } = require('stream');
const DB = require('./db');
class Logger extends Transform {
    constructor(options) {
        super(options);
        this.db = new DB();
    }

    _transform(customer, undefined, done) {
        // console.log('→Logger', customer);
        this.push(customer);
        this.db.newCustomer(customer, process.argv[ 1 ]);
        done();
    }
}
module.exports = Logger;
