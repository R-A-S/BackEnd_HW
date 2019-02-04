const { Writable } = require('stream');

class AccountManager extends Writable {
    constructor(options) {
        super(options);
        this.storage = [];
    }

    _write(customer, undefined, done) {
        // console.log('→AccountManager', customer);
        this.storage.push(customer);
        console.log('→ AccountManager receives customer : ', customer);
        done();
    }
}

module.exports = AccountManager;
