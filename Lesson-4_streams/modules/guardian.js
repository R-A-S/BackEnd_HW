const { Transform } = require('stream');
class Guardian extends Transform {
    constructor(options) {
        super(options);
    }

    _randomAlgorithm() {
        const algorithms = [ 'hex', 'base64' ];
        const algorithm = algorithms[ Math.floor(Math.random() * algorithms.length) ];

        return algorithm;
    }

    _transform(customer, undefined, done) {
        // console.log('→Guardian', customer);

        const algorithm = this._randomAlgorithm();

        this.push({
            meta: {
                source:    'ui',
                algorithm: algorithm,
            },
            payload: {
                name:     customer.name,
                email:    Buffer.from(customer.email, 'utf8').toString(algorithm),
                password: Buffer.from(customer.password, 'utf8').toString(algorithm),
            },
        });
        done();
    }
}

module.exports = Guardian;
