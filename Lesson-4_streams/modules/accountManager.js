const { Writable } = require('stream');

class AccountManager extends Writable {
    constructor(options) {
        super(options);
        this.storage = [];
    }

    _write(customer, undefined, done) {
        this.storage.push(customer);
        console.log(customer.payload);
        done();
    }
}

module.exports = AccountManager;

// 1. Реализовать класс AccountManager который реализует Writable
// интерфейс и будет служить в качестве хранилища данных.

// 2. Когда AccountManager получает объект он должен вывести в консоль payload.
