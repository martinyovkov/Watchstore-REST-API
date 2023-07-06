const router = require('express').Router();
const watchService = require('../services/watchService');
const {isAuthenticated, isAdmin} = require('../middlewares/authMiddlewares');


router.post('/create', isAuthenticated, isAdmin, ((req, res) => {
   watchService.create({...req.body, publisherId: req.session.user._id})
    .then(watch => res.json(watch))
    .catch(error => res.status(400).json({...error}));
}))

router.get('/', (req, res) => {
    watchService.getAll()
        .then(data => res.json(data))
        .catch(err => []);

});

router.get('/:_id', (req, res) => {

    watchService.getById(req.params._id)
        .then(watch => res.json(watch))
        .catch(err => res.json(null));

});

router.put('/:_id', isAuthenticated, isAdmin, (req, res) => {

    watchService.edit({ _id: req.params._id, ...req.body })
        .then(watch => res.json(watch))
        .catch(error => res.status(400).json({ status: 400, ...error }));

});

router.delete('/:_id', isAuthenticated, isAdmin, async (req, res) => {

    try {
        const wacth = await watchService.getById(req.params._id);
        await watchService.remove(req.params._id);    

        //await clearVehicleFromCarts(req.params._id);
        //await clearVehicleFromWishLists(req.params._id);

    } catch (error) {
        res.status(400).json({ status: 400, ...error })
    }

    res.json({ status: 200, message: 'Watch has been deleted!' });

});

module.exports = router;
