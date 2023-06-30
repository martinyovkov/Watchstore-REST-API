const Watch = require('../models/Watch');

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

module.exports = {getAll, create, edit, remove, getById };