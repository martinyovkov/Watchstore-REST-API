const router = require('express').Router();

const authController = require('./controllers/');


router.use(authController);


module.exports = router;