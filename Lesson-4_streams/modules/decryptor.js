const { Transform } = require('stream');
class Decryptor extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(customer, undefined, done) {
        // console.log('→Decryptor', customer);

        try {
            if (!(customer.meta.algorithm === 'hex' || customer.meta.algorithm === 'base64')) {
                this.emit(
                    'error',
                    new Error('A terrible algorithmic error in Decriptor, game over!💥'),
                );
            }
            const validCustomer = this._validate({
                name:  customer.payload.name,
                email: Buffer.from(customer.payload.email, customer.meta.algorithm).toString(
                    'utf8',
                ),
                password: Buffer.from(customer.payload.password, customer.meta.algorithm).toString(
                    'utf8',
                ),
            });
            this.push(validCustomer);

            done();
        } catch (error) {
            this.push(null);
            console.error(`→ ${error.name} ${error.message}`);
        }
    }

    _validate(customer) {
        if (Object.keys(customer).toString() !== 'name,email,password') {
            this.emit(
                'error',
                new Error(
                    'Something went wrong in Decriptor👾 Only name,email and password fields are required.🛑',
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
                            'Something went wrong in Decriptor👾 All fields are required.🛑 Only strings are accepted.📝',
                        ),
                    );
                }
            }
        }

        return customer;
    }
}
module.exports = Decryptor;
