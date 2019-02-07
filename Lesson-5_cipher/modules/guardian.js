const { Transform } = require('stream');
const crypto = require('crypto');

class Guardian extends Transform {
    constructor(options) {
        super(options);
        this.pass = 'my_encryption_pass_1234!@#$';
    }

    _transform(customer, encoding, done) {
        const { email, password } = customer;
        const mail = this._encrypt(email);
        const pass = this._encrypt(password);
        const encryptedCustomer = {
            name:     customer.name,
            email:    mail,
            password: pass,
        };

        const signedCustomer = {
            meta: {
                source:    'ui',
                signature: this._sign(encryptedCustomer),
            },
            payload: encryptedCustomer,
        };
        this.push(signedCustomer);
        done();
    }

    _encrypt(data) {
        const buf = Buffer.alloc(16);
        const iv = crypto.randomFillSync(buf, 10);
        const key = crypto.scryptSync(this.pass, 'salt', 24);
        const cipher = crypto.createCipheriv('aes192', key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');

        return iv.toString('hex') + ':' + encrypted;
    }

    _sign(data) {
        const sign = crypto.createSign('RSA-SHA256');

        const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC95vdI01qH0QsiNFRNT5eAnK5b9vS3vAm4ILt8c/AZKO1G+PaJ
CNU+cRY+7tbHkHRucIcaLsUl4QaFBHUxKp1AfZnC0NPrH/Q8FFcmtiXebL4GN+un
MgK7jeP+2eEEop6PFfW+NcNvM0knNkeRp8wHVfjCfB4FCB00W7R4HF/o4QIDAQAB
AoGAKQz/ka+Wl1t6E6fKPXgiIPw9uMWWuw0b8MCqpsmNMnMlb70r1g2hw0DA9VO9
/B/e+2y519AacAjH1wNSrhEvMr1SwmLtAVV4TAl8tzPJM02Efq4XcduWRj/HXBzz
3Dyl02Zew6a72xFopQmxASGvOGIc6bOWCDxKhfmJFejKjZ0CQQDj/n0RUlt2oEjt
yQatMCBE/XBATdiLRsJTIWBXq+RGdjCk0KXhht3JMekW4u7Np6FGa9yPi7QjQfIv
gxXOgRlfAkEA1TqjcpMHw+XSMcyeDBjMHEypgjG7Aiq6gc0VcNezQuBbw5iZYI0g
3mCitpE8i2LUcgJkySQJeY9pyAdmIyTlvwJBAJJGkXlOjI30UjX1FsqAqQN6Us1+
5GKfOEfbjxNQnjmy1Iy5rOOgAqV11yUu3aWmWetzgmO6bw173uUqxg/idiMCQBvz
jt+DFJ6CbvZmO0Wcroz7I7FUcY5MKZzAVJIxRGd836qZQ2nbtjZQdqP2D/i5oN29
IJcZaUCNIzG8fpAW0yMCQHw1rF/rBwszUD+s5bo/nQnxy576zHb0O7TP99wH0hjL
xsD4YeMpBFfjc7hsBHz47sqPecXlr4F3gGBagCQWK9I=
-----END RSA PRIVATE KEY-----
        `;

        sign.update(JSON.stringify(data));

        return sign.sign(privateKey).toString('hex');
    }
}

module.exports = Guardian;
