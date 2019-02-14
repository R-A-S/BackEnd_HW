const net = require('net');
const fs = require('fs');
const { promisify } = require('util');

const path = require('path');
const filter = require('./helpers').filter;
const validate = require('./helpers').validate;
//const timestamp = require('./helpers');

const server = net.createServer();
const PORT = process.env.PORT || 8080;

const readFile = promisify(fs.readFile);
let usersArray = [];

server.on('connection', (socket) => {
    socket.setEncoding('utf8');
    console.log('New client connected!');

    socket.on('data', (filterMsg) => {
        const filterOptions = JSON.parse(filterMsg);
        // try {
        validate(socket, filterOptions);
        // } catch (error) {
        //     console.log(error);
        // }

        const filteredUsers = filter(usersArray, filterOptions);

        socket.write(JSON.stringify(filteredUsers));
    });

    socket.on('error', (error) => {
        console.error(`${error} \n`);
    });

    socket.on('end', () => {
        console.log('Client is disconnected!');
    });
});

server.on('listening', () => {
    const { port } = server.address();

    readFile(path.join(__dirname, './data', 'users.json'))
        .then((users) => JSON.parse(users))
        .then((users) => {
            usersArray = users;
        })
        .catch((error) => console.error('→ Server Listening', error.name, error.message));

    console.log(`TCP Server started on port ${port}!`);
});

server.listen(PORT);
