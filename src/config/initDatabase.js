const mongoose = require('mongoose');

exports.connectDatabase = () => {
    mongoose.connection.on('open', () => console.log('Database is connected!'));

    return mongoose.connect(process.env.DB_QUERYSTRING);
}
