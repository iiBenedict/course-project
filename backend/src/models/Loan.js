const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },

        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true
        },

        borrowDate: {
            type: Date,
            default: Date.now
        },

        dueDate: {
            type: Date,
            required: true
        },

        returnDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ['Active', 'Returned', 'Late'],
            default: 'Active'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Loan', loanSchema);