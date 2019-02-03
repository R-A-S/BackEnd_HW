const { Ui, Guardian, AccountManager } = require('./modules');

const customers = [
    {
        name:     'Pitter Black',
        email:    'pblack@email.com',
        password: 'pblack_123',
    },
    {
        name:     'Oliver White',
        email:    'owhite@email.com',
        password: 'owhite_456',
    },
];

const ui = new Ui(customers, { objectMode: true, highWaterMark: 1 });
const guardian = new Guardian({
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings:      false,
});
const manager = new AccountManager({ objectMode: true, highWaterMark: 1 });

ui.pipe(guardian).pipe(manager);
