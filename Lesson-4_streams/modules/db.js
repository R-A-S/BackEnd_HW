const { EventEmitter } = require('events');
class DB extends EventEmitter {
    constructor(options) {
        super(options);
        this.storage = [];
        this.on('newCustomer', (customer, source) => {
            this.storage.push({
                source:  source,
                payload: customer,
                created: new Date(),
            });
        });
    }

    newCustomer(customer, source) {
        this.emit('newCustomer', customer, source);
    }
}
module.exports = DB;
