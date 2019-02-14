const net = require('net');
const PORT = 8080;
const timestamp = require('./helpers').timestamp;

const filter = {
    name: {
        first: 'an',
        last:  'rg',
    },
    email:   '@gmail.com',
    // name: {
    //     first: 'a',
    //     last:  'la',
    // },
    // phone:   '1',
    address: {
        city: 'in',
        //     country: 'Tu',
    },
};

const client = new net.Socket();
client.connect(PORT, () => {
    console.log(`Connected!, ${timestamp()}`);
    client.write(JSON.stringify(filter));
});

client.on('data', (data) => {
    const msg = JSON.parse(data);
    console.log('Filtered Users : ', '\n', msg);
});

client.on('close', () => {
    console.log(`Connection closed! ${timestamp()}`);
});
