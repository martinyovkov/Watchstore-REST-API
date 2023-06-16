const express = require('express');
const {connectDatabase} = require('./src/config/initDatabase');
const dotenv = require('dotenv');
const router = require('./src/router');

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(require('cors')({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(require('cookie-parser'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router)

if (process.env.ENVIRONMENT !== 'development') {
    app.set('trust proxy', 1);
}

connectDatabase()
    .then(()=>{
        app.listen(PORT,()=> console.log(`Server is listening on port: ${PORT}`));
    })
    .catch(err=>{
        console.log(('Application failed:', err));
    });

    





