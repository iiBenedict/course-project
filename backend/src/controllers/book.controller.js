const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get books'
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get book'
        });
    }
};

const addBook = async (req, res) => {
    try {
        const book = await Book.create({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            isbn: req.body.isbn,
            publishedYear: req.body.publishedYear,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add book',
            error: error.message
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update book'
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json({
            message: 'Book deleted successfully',
            book
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete book'
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};