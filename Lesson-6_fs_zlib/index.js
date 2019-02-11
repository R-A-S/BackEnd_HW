const Json2csv = require('./modules/json2csv');
const options = {
    filter: [ 'postId', 'name', 'body' ],
};

const json2csv = new Json2csv(options);
json2csv.convert('comments.json');
