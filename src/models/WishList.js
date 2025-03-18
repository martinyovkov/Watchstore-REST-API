const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner _id is required']
    },
    items: {
        type: [mongoose.Types.ObjectId]
    },
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;