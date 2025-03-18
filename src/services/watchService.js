const Watch = require('../models/Watch');
const WishList = require('../models/WishList');

const normalize = require('../utils/MongoErrorNormalizer');

const create = async (watch) => Watch.create(watch)
    .then(watch => watch)
    .catch(err => { throw {...err} })

const getAll = async () => {
    try { return await Watch.find({}).lean() }
    catch (error) { return [] }
}

const edit = async (watch) => {

    let updatedWatch;

    try {
        updatedWatch = await Watch.findByIdAndUpdate(watch._id, watch, {
            runValidators: true,
            new: true
        })

        return updatedWatch;
    } catch (err) { throw normalize('Watch editing error!', err); }
}

const remove = async (_id) => {
    try {
        await Watch.findByIdAndDelete(_id)
        return true
    } catch (err) { throw normalize('Watch deletion error!', err) }
}

const getById = async (_id) => {
    try {
        const watch = await Watch.findById(_id).lean()

        if (!watch) { return null }

        return watch
    } catch (error) { return null }
}

const addToWishList = async(watch_id, user_id) => {
    try{
        const owner_id = user_id;
        const wishlist = await WishList.findOne(owner_id).lean();

        if (!wishlist) {
            wishlist = await WishList.create(owner_id).lean();
        }

        if (!wishlist.items.includes(watch_id)) {
            wishlist.items.push(watch_id);
        }else {
            const index = wishlist.items.indexOf(watch_id);
            wishlist.items.slice(index, i); 
        }
    } catch (err) {throw normalize('Wish list error!', err)}
}

module.exports = {getAll, create, edit, remove, getById, addToWishList };