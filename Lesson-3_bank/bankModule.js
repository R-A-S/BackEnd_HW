const EventEmitter = require('events');

class Bank extends EventEmitter {
    constructor() {
        super();
        this.accounts = [];
        this.on('add', this._add);
        this.on('get', this._get);
        this.on('withdraw', this._withdraw);
        this.on('send', this._send);
        this.on('changeLimit', this._changeLimit);
        this.on('error', (error) => console.error(`${error}`));
    }

    register(newAccount) {
        let notValid = this._validation('register', { ...newAccount });
        if (notValid) {
            return;
        }
        const id = `${newAccount.name
            .toLocaleUpperCase()
            .split(' ')
            .join('')}${Date.now()}`;
        this.accounts.push({ id: id, ...newAccount });

        return id;
    }

    _add(id, sum) {
        let notValid = this._validation('add', { id, sum });
        if (notValid) {
            return;
        }
        this.accounts.find((account) => account.id === id).balance += Number(sum);
    }

    _get(id, callback) {
        let notValid = this._validation('get', { id });
        if (notValid) {
            return;
        }
        const balance = this.accounts.find((account) => account.id === id).balance;
        callback(balance);
    }

    _withdraw(id, sum) {
        const person = this.accounts.find((account) => account.id === id);
        const notValid = this._validation('withdraw', { id, sum, balance: person.balance });
        const limit = this._validation('limit', {
            limit:          person.limit,
            sum,
            currentBalance: person.balance,
            updatedBalance: person.balance - sum,
        });
        if (notValid || limit) {
            return;
        }
        person.balance -= Number(sum);
    }

    _send(firstId, secondId, sum) {
        let notValid = this._validation('send', {
            id: [ firstId, secondId ],
            sum,
        });
        const person = this.accounts.find((account) => account.id === firstId);
        const limit = this._validation('limit', {
            limit:          person.limit,
            sum,
            currentBalance: person.balance,
            updatedBalance: person.balance - sum,
        });
        if (notValid || limit) {
            return;
        }
        const firstBalance = this.accounts.find((account) => account.id === firstId);
        const secondBalance = this.accounts.find((account) => account.id === secondId);
        if (firstBalance.balance - sum < 0) {
            this.emit('error', new Error('Not enough money!!!👋'));

            return true;
        }
        firstBalance.balance -= Number(sum);
        secondBalance.balance += Number(sum);
    }

    _changeLimit(personId, callback) {
        const person = this.accounts.find((account) => account.id === personId);
        person.limit = callback;
    }

    _validation(operation, args) {
        const { limit, id, sum, name, balance, currentBalance, updatedBalance } = args;
        const accounts = this.accounts;
        switch (operation) {
            case 'register':
                if (accounts.some((account) => account.name === name)) {
                    this.emit(
                        'error',
                        new Error(`The name must be unique. Go to another bank ${name} !!!👋`),
                    );

                    return true;
                }
                if (balance <= 0) {
                    this.emit(
                        'error',
                        new Error(`Balance can\'t be negative. Go away ${name} !!!👋`),
                    );

                    return true;
                }
                break;

            case 'add':
                if (sum <= 0) {
                    this.emit('error', new Error('Are you kidding?!!!👋'));

                    return true;
                }
                if (!accounts.some((account) => account.id === id)) {
                    this.emit('error', new Error('Not your day?!!!👋'));

                    return true;
                }
                break;

            case 'get':
                if (sum <= 0) {
                    this.emit('error', new Error('Are you kidding?!!!👋'));

                    return true;
                }
                if (!accounts.some((account) => account.id === id)) {
                    this.emit('error', new Error('Not your day?!!!👋'));

                    return true;
                }
                break;

            case 'withdraw':
                if (sum < 0) {
                    this.emit('error', new Error('Are you kidding?!!!👋'));

                    return true;
                }
                if (balance - sum < 0) {
                    this.emit('error', new Error('Are you kidding?!!!👋'));

                    return true;
                }
                if (!accounts.some((account) => account.id === id)) {
                    this.emit('error', new Error('Not your day?!!!👋'));

                    return true;
                }
                break;

            case 'send':
                if (sum < 0) {
                    this.emit('error', new Error('Are you kidding?!!!👋'));

                    return true;
                }
                if (!accounts.some((account) => account.id === id[ 0 ])) {
                    this.emit('error', new Error('Not your day personFirstId!!!👋'));

                    return true;
                }
                if (!accounts.some((account) => account.id === id[ 1 ])) {
                    this.emit('error', new Error('Not your day personSecondId!!!👋'));

                    return true;
                }
                break;

            case 'limit':
                if (!limit(sum, currentBalance, updatedBalance)) {
                    this.emit(
                        'error',
                        new Error('The operation doesn\'t meet the conditions of the limit.!👋'),
                    );

                    return true;
                }
                break;

            default:
                break;
        }
    }
}

module.exports = Bank;
