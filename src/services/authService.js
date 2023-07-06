const User = require('../models/User');

const util = require('util');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET } = process.env;

const create = async (userData) => (
     User.create(userData))
    .then(user => { return user; })
    .catch(err => {
        let error = {};

        if (err.name == 'ValidationError') {

            error.message = 'User Validation Error';
            error.errors = {};

            const keys = Object.keys(err.errors);

            keys.forEach(key => {

                if (err.errors[key].properties) {

                    error.errors[key] = err.errors[key].properties.message;

                } else {

                    error.errors[key] = 'Invalid data type';

                }

            });

        } else if (err.name == 'MongoServerError') {

            error.message = 'This email already exists!';

        }
        else {

            error.message = err.name;
        }

        throw error;
    });

const login = async (email, password) => {
    let user = await getUserByEmail(email);

    if (!user) {
        throw { message: 'Invalid email or password!' };
    }
    
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw { message: 'Invalid email or password!' };
    }

    return { ...user};
};

/* exports.createToken = (user) => {

    const payload = {
        ...user
    };

    const options = { expiresIn: '2d' }

    const tokenPromise = new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET, options, (err, decodedToken) => {
            if (err) {
                return reject(err);
            }
            resolve(decodedToken);
        });
    });

    return tokenPromise;
} */

/* const verifyJWTPromisified = util.promisify(jwt.verify);
exports.verifyAccessToken = (token) => verifyJWTPromisified(token, process.env.SECRET) */

const getUserByEmail = (email) => User.findOne({ email })
    .lean()
    .then(user => user)
    .catch(err => null)

module.exports = {create, login, getUserByEmail};