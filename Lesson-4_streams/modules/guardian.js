const { Transform } = require('stream');
class Guardian extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(customer, undefined, done) {
        this.push({
            meta: {
                source: 'ui',
            },
            payload: {
                name:     customer.name,
                email:    Buffer.from(customer.email, 'utf8').toString('hex'),
                password: Buffer.from(customer.password, 'utf8').toString('hex'),
            },
        });
        done();
    }
}

module.exports = Guardian;

// 2. Реализовать класс Guardian который будет имплементировать Transform интерфейс
// и будет служить для шифрования данных. Для шифрования пароля будем
// использовать преобразование строки в hex формат. Зашифровать необходимо email
// и password.
// Пример преобразования для первого объекта.

// Было
// {
//     name: 'Pitter Black',
//     email: 'pblack@email.com',
//     password: 'pblack_123'
// }
// Стало
// {
//     meta: {
//         source: 'ui'
//     },
//     payload: {
//         name: 'Pitter Black',
//         email: '70626c61636b40656d61696c2e636f6d',
//         password: '70626c61636b5f313233'
//     }
// }
