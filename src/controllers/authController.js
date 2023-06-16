const router = require('express').Router();

const authService = require('../services/authService');

const { COOKIE_SESSION_NAME } = process.env;

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 400, message: 'Email and pasword are required!' });
    }

    try {
        const user = await authService.login(email, password);

        const responseUser = {
            _id: user._id,
            email: user.email,
            username: user.username
        }

        const token = await authService.createToken(responseUser);

        const cookieSettings = { httpOnly: true }

        if (process.env.ENVIRONMENT !== 'development') {
            cookieSettings.secure = true
            cookieSettings.sameSite = 'none'
        }

        res.cookie(COOKIE_SESSION_NAME, token, cookieSettings);

        res.status(200).json(responseUser);

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, ...error });
    }

});


router.post('/register', async (req, res) => {
    const { email, username, password, rePassword } = req.body;

    if (password !== rePassword) {
        return res.status(400).json({ status: 400, message: 'Password mismatch!' })
    }

    try {
        const existing = await authService.getUserByEmail(email);

        if (existing) { throw { message: 'This email already exists!' } }

        const user = await authService.create('User', { email, username, password });

        const responseUser = {
            _id: user._id,
            email: user.email,
            username: user.username
        }

        const token = await authService.createToken(responseUser);

        const cookieSettings = { httpOnly: true }

        if (process.env.ENVIRONMENT !== 'development') {
            cookieSettings.secure = true
            cookieSettings.sameSite = 'none'
        }

        res.cookie(COOKIE_SESSION_NAME, token, cookieSettings);
        res.json({ status: 200, user });
        res.end();

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, ...error });
    }

});

router.get('/logout', (req, res) => {

    const cookieSettings = {
        path: '/',
        httpOnly: true,
    };

    if (process.env.ENVIRONMENT !== 'development') {
        cookieSettings.secure = true
        cookieSettings.sameSite = 'none'
    }

    res.clearCookie(COOKIE_SESSION_NAME, cookieSettings);

    res.status(200).json({ message: 'Logged out!' })
});

router.get('/me', async (req, res) => {
    const token = req.cookies[COOKIE_SESSION_NAME];

    if (!token) {
        return res.status(400).json({ status: 400, message: 'You are not logged in!' })
    }

    try {
        const decodedToken = await authService.verifyAccessToken(token);
        return res.status(200).json({ status: 200, user: { ...decodedToken } })

    } catch (error) {
        res.clearCookie(COOKIE_SESSION_NAME);
        res.status(400).json({ status: 400, ...error });
    }
});

module.exports = router;