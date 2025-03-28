const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

const {connectDatabase} = require('./src/config/initDatabase');
const {assureAdminIsCreated} = require('./src/config/adminCreate');

const router = require('./src/router');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const PORT = process.env.PORT || 3001;

app.use(require('cors')({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));



const sessionSettings = {
    secret: process.env.SECRET,
    resave: false,
    cookie: {
        httpOnly: true
    },
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_QUERYSTRING })
}

if (process.env.ENVIRONMENT !== 'development') {
    app.set('trust proxy', 1)
    sessionSettings.cookie.secure = true
    sessionSettings.cookie.sameSite = 'none'
}

app.use(session(sessionSettings));

app.use(router);
connectDatabase()
    .then(()=>{
        app.listen(PORT, ()=> console.log(`Server is listening on port: ${PORT}`));
    })
    .catch(err=>{
        console.log(('Application failed:', err));
    });

assureAdminIsCreated();