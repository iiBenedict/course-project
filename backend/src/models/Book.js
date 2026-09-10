const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        author: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        isbn: {
            type: String,
            required: true,
            unique: true
        },

        publishedYear: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['Available', 'Borrowed'],
            default: 'Available'
        },

        image: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Book', bookSchema);