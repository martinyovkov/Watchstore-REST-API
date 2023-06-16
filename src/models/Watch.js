const mongoose = require('mongoose');

const validator = require('validator');

const watchShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Watch name is required!'],
            minlength: [4, 'Name is too short! (It should be atleast 4 symbols)'],
            maxlength: [99, 'Name is too long! (It should be less than 100 symbols)'],
            trim: true
            
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be less than 0'],
            max: [999999999, 'Price cannot be greater than 999999999']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [10, 'Description too short! (It should be at least 10 symbols)'],
            maxlength: [3000, 'Description too long! (It should be max 3000 symbols)'],
            trim: true
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['Luxury', 'Casual', 'Retro', 'Dress'],
                message: 'Invalid value: {VALUE}. Available values are: Luxury, Casual, Retro, Dress'
            }
        },
        movement: {
            type: String,
            required: [true, 'Movement is required'],
            enum: {
                values: ['Automatic', 'Mechanical', 'Quartz'],
                message: 'Invalid value: {VALUE}. Available values are: Automatic, Mechanical, Quartz'
            }
        },
        waterResistance: {
            type: Number,
            required: [true, 'Water resistance is required'],
            min: [0, 'Water resistance cannot be less than 0 m'],
            max: [1000, 'Water resistance cannot be greater than 1000 m']
        },
        publisherId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Publisher id is required'],
            trim: true
        }
    }
);

watchShema
    .path('imageUrl')
    .validate(
        (value) => validator.isURL(value)
        , 'Invalid image url'
    );

const Watch = mongoose.model('Watch', watchShema);
module.exports = Watch;



