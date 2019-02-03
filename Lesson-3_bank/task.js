const Bank = require('./bankModule');
// *Задача 1
const bank = new Bank();

const personFirstId = bank.register({
    name:    'Pitter Black',
    balance: 100,
    limit:   (amount) => amount < 100,
});

bank.emit('add', personFirstId, 20);

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // *I have 120₴
});

bank.emit('withdraw', personFirstId, 50);

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // *I have 70₴
});

// *Задача 2
const personSecondId = bank.register({
    name:    'Oliver White',
    balance: 700,
    limit:   (amount) => amount < 51,
});

bank.emit('send', personFirstId, personSecondId, 50);

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // *I have 20₴
});
bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // *I have 750₴
});
bank.emit('withdraw', personSecondId, 50);
bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // *I have 700₴
});
// *Задача 3
bank.emit('withdraw', personSecondId, 5);
bank.emit('get', personSecondId, (amount) => {
    console.log(`I have ${amount}₴`); // *I have 695₴
});
// Вариант 1
bank.emit('changeLimit', personSecondId, (amount, currentBalance, updatedBalance) => {
    return amount < 100 && updatedBalance > 700;
});
bank.emit('withdraw', personSecondId, 15); // !Error
// Вариант 2
bank.emit('changeLimit', personSecondId, (amount, currentBalance, updatedBalance) => {
    return amount < 100 && updatedBalance > 700 && currentBalance > 800;
});
// Вариант 3
bank.emit('changeLimit', personSecondId, (amount, currentBalance) => {
    return currentBalance > 800;
});
// Вариант 4
bank.emit('changeLimit', personSecondId, (amount, currentBalance, updatedBalance) => {
    return updatedBalance > 900;
});
