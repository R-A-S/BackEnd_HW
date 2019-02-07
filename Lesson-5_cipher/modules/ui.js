const { Readable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    _read() {
        let customer = this._validate(this.data.shift());

        if (!customer) {
            this.push(null);
        } else {
            this.push(customer);
        }
    }

    _validate(customer) {
        if (customer) {
            if (Object.keys(customer).toString() !== 'name,email,password') {
                this.emit(
                    'error',
                    new Error(
                        'Something went wrong in Ui👾 Only name,email and password fields are required.🛑',
                    ),
                );
            }
            for (const key in customer) {
                if (customer.hasOwnProperty(key)) {
                    const element = customer[ key ];
                    if (typeof element !== 'string' || !element.trim()) {
                        this.emit(
                            'error',
                            new Error(
                                'Something went wrong in Ui👾 All fields are required.🛑 Only strings are accepted.📝',
                            ),
                        );
                    }
                }
            }

            return customer;
        }

        return null;
    }
}

module.exports = Ui;
