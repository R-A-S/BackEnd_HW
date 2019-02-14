const _filter = (userObject, filterOptions) => {
    let flags = [];
    for (const key in userObject) {
        if (userObject.hasOwnProperty(key) && typeof userObject[ key ] !== 'object') {
            const user = userObject[ key ];
            const filter = filterOptions[ key ];

            filter ? flags.push(!!user.includes(filter)) : null;
        }
    }

    const flag = flags.every((flag) => flag);

    return flag;
};

const filter = (usersArray, filterOptions) => {
    const filteredUsersArray = usersArray.filter((userObject) => {
        return (
            _filter(userObject, filterOptions)
            && _filter(userObject.name, filterOptions.name)
            && _filter(userObject.address, filterOptions.address)
        );
    });

    return filteredUsersArray;
};

const timestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

const validate = (socket, filter) => {
    const allowedStringFields = [
        'first',
        'last',
        'phone',
        'zip',
        'city',
        'country',
        'street',
        'email',
    ];
    const allowedObjectFields = [ 'name', 'address' ];

    for (const key in filter) {
        if (filter.hasOwnProperty(key) && typeof filter[ key ] === 'string') {
            const done = allowedStringFields.some((field) => field === key);
            if (!done) {
                socket.emit('error', new Error(`Field validation error in: ${key}`));
            }
        } else if (filter.hasOwnProperty(key) && typeof filter[ key ] === 'object') {
            const done = allowedObjectFields.some((field) => field === key);
            const objDone = validate(socket, filter[ key ]);
            if (!done || !objDone) {
                socket.emit('error', new Error(`Field validation error in: ${key}`));
            }
        } else if (filter.hasOwnProperty(key)) {
            socket.emit('error', new Error(`Not allowed type of: ${key}`));
        }
    }
};

module.exports = {
    filter,
    timestamp,
    validate,
};
