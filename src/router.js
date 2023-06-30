const router = require('express').Router();

const authController = require('./controllers/authController');
const watchController = require('./controllers/watchController');


router.use(authController);
router.use('/wacthes', watchController);


module.exports = router;