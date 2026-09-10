const Loan = require('../models/Loan');
const Book = require('../models/Book');

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('book')
            .populate('member')
            .sort({ createdAt: -1 });

        res.json(loans);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get loans'
        });
    }
};

const createLoan = async (req, res) => {
    try {
        const { book, member, dueDate } = req.body;

        const selectedBook = await Book.findById(book);

        if (!selectedBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        if (selectedBook.status === 'Borrowed') {
            return res.status(400).json({
                message: 'Book is already borrowed'
            });
        }

        const loan = await Loan.create({
            book,
            member,
            dueDate
        });

        selectedBook.status = 'Borrowed';

        await selectedBook.save();

        const populatedLoan = await loan.populate([
            'book',
            'member'
        ]);

        res.status(201).json(populatedLoan);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create loan',
            error: error.message
        });
    }
};

const returnLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                message: 'Loan not found'
            });
        }

        loan.status = 'Returned';
        loan.returnDate = new Date();

        await loan.save();

        await Book.findByIdAndUpdate(
            loan.book,
            {
                status: 'Available'
            }
        );

        res.json({
            message: 'Book returned successfully',
            loan
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to return book'
        });
    }
};

module.exports = {
    getAllLoans,
    createLoan,
    returnLoan
};