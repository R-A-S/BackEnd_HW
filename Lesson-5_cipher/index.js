const { Ui, Guardian, Logger, Decryptor, AccountManager } = require('./modules');

const customers = [
    {
        name:     'Pitter Black',
        email:    'pblack@email.com',
        password: 'pblack_123',
    },
    {
        name:     1,
        email:    'owhite@email.com',
        password: 'owhite_123',
    },
];

const ui = new Ui(customers, { objectMode: true, highWaterMark: 1 });

const guardian = new Guardian({
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings:      false,
});

const logger = new Logger({ objectMode: true, highWaterMark: 1 });

const decryptor = new Decryptor({
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings:      false,
});

const manager = new AccountManager({ objectMode: true, highWaterMark: 1 });

ui.on('error', ({ name, message }) => {
    console.error(`→ ${name} ${message}`);
    process.exit(1);
})
    .pipe(guardian)
    .on('error', ({ name, message }) => {
        console.error(`→ ${name} ${message}`);
        process.exit(1);
    })
    .pipe(logger)
    .on('error', ({ name, message }) => {
        console.error(`→ ${name} ${message}`);
        process.exit(1);
    })
    .pipe(decryptor)
    .on('error', ({ name, message }) => {
        console.error(`→ ${name} ${message}`);
        process.exit(1);
    })
    .pipe(manager)
    .on('error', ({ name, message }) => {
        console.error(`→ ${name} ${message}`);
        process.exit(1);
    });
