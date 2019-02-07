const { Writable } = require('stream');
const crypto = require('crypto');

class AccountManager extends Writable {
    constructor(options) {
        super(options);
        this.storage = [];
        this.pass = 'my_encryption_pass_1234!@#$';
    }

    _write(customer, encoding, done) {
        const {
            payload: { email, password },
        } = customer;
        this._verify(customer);
        const mail = this._decrypt(email);
        const pass = this._decrypt(password);

        this.storage.push({
            name:     customer.payload.name,
            email:    mail,
            password: pass,
        });
        console.log('→ AccountManager → customers in storage: ', this.storage);
        done();
    }

    _decrypt(encrypted) {
        const iv = Buffer.from(encrypted.split(':')[ 0 ], 'hex');
        const key = crypto.scryptSync(this.pass, 'salt', 24);
        const decipher = crypto.createDecipheriv('aes192', key, iv);
        let decrypted
            = decipher.update(encrypted.split(':')[ 1 ], 'hex', 'utf8') + decipher.final('utf8');

        return decrypted;
    }

    _verify(customer) {
        const privateKey = `
-----BEGIN CERTIFICATE-----
MIICATCCAWoCCQDAdlri7GP7PzANBgkqhkiG9w0BAQsFADBFMQswCQYDVQQGEwJB
VTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0
cyBQdHkgTHRkMB4XDTE5MDIwNzE2MzMyNVoXDTE5MDMwOTE2MzMyNVowRTELMAkG
A1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0
IFdpZGdpdHMgUHR5IEx0ZDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAveb3
SNNah9ELIjRUTU+XgJyuW/b0t7wJuCC7fHPwGSjtRvj2iQjVPnEWPu7Wx5B0bnCH
Gi7FJeEGhQR1MSqdQH2ZwtDT6x/0PBRXJrYl3my+BjfrpzICu43j/tnhBKKejxX1
vjXDbzNJJzZHkafMB1X4wnweBQgdNFu0eBxf6OECAwEAATANBgkqhkiG9w0BAQsF
AAOBgQAAtnFGD0Q0b0omrsy554rmtmSdrAYDzwJ1YJ2G5Vp2aQhR0I5hwHc/HZ8p
AfALYPPthfalR/nvJD3b2q+tLdH8PJBB0Q51HJvPg8nFkB9PCKyqq4+ogjEFPLRl
nzNR6Tz4o2+tgrbbRstDkKOH42YEg7GC9mhwIPxMhgFzdBAJMw==
-----END CERTIFICATE-----
        `;
        try {
            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(JSON.stringify(customer.payload));
            const signature = Buffer.from(customer.meta.signature, 'hex');

            verify.verify(privateKey, signature);
        } catch (error) {
            this.emit('error', new Error(`Verification failed! 🛑   ${error.message}`));
        }
    }
}

module.exports = AccountManager;
