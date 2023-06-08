const mongoose = require('mongoose');
const { DB_QUERYSTRING } = process.env;

exports.connectDatabase = () => {
    mongoose.connection.on('open', () => console.log('Db is connected!'));

    return mongoose.connect(DB_QUERYSTRING);
}