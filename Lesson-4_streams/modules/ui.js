const { Readable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    _read() {
        try {
            let customer = this._validate(this.data.shift());
            // console.log('→Ui', customer);

            if (!customer) {
                this.push(null);
            } else {
                this.push(customer);
            }
        } catch (error) {
            this.push(null);
            console.error(`→ ${error.name} ${error.message}`);
        }
    }

    _validate(customer) {
        if (customer) {
            if (Object.keys(customer).toString() !== 'name,email,password') {
                throw new Error('Something went wrong in Ui👾 Only name,email and password fields are required.🛑');
            }
            for (const key in customer) {
                if (customer.hasOwnProperty(key)) {
                    const element = customer[ key ];
                    if (typeof element !== 'string' || !element.trim()) {
                        throw new Error('Something went wrong in Ui👾 All fields are required.🛑 Only strings are accepted.📝');
                    }
                }
            }

            return customer;
        }

        return null;
    }
}

module.exports = Ui;
