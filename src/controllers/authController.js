const router = require('express').Router();

const {isAuthenticated} = require('../middlewares/authMiddlewares');
const authService = require('../services/authService');

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 400, message: 'Email and password are required!' });
    }

    try {
        const user = await authService.login(email, password);

        req.session.regenerate(function (err) {
            if (err) return res.json(err)

            req.session.user = user

            res.status(200).json(user);
        });

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

        const user = await authService.create({ email, username, password });

        req.session.regenerate(function (err) {
            if (err) return res.json(err)

            req.session.user = user;

            res.status(200).json(user);
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, ...error });
    }

});

router.get('/logout', isAuthenticated, (req, res) => {

    console.log(req.session);
    req.session.user = null;

    res.status(200).json({ message: 'Logged out!' })
});

router.get('/me', async (req, res) => {
    res.json(req.session.user) 
});

module.exports = router;