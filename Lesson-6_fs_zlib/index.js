const Json2csv = require('./modules/json2csv');
const Archiver = require('./modules/archiver');
const options = {
    fields: [ 'postId', 'name', 'body' ],
};

const json2csv = new Json2csv(options);
const archiver = new Archiver(options);

json2csv.convert('comments.json');


archiver.zip('comments.json', {
    algorithm: 'gzip',
});
//!Работает только при закоментированном zip методов одновременно
//archiver.unzip('comments.json.gz');
