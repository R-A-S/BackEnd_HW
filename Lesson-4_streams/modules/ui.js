const { Readable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    _read() {
        try {
            let customer = this._validate(this.data.shift());
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
                throw new Error('fields = false');
            }
            for (const key in customer) {
                if (customer.hasOwnProperty(key)) {
                    const element = customer[ key ];
                    if (typeof element !== 'string') {
                        throw new Error('type = false');
                    }
                }
            }

            return customer;
        }

        return customer;
    }
}

module.exports = Ui;

// 1. Реализовать класс Ui который будет имплементировать Readable интерфейс и будет
// служить поставщиком данных.
/*
Обратите внимание!
1. Все поля являются обязательными.
2. Все поля должны быть строками.
3. Объект не должен содержать дополнительных полей.
*/
