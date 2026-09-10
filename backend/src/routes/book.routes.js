const express = require('express');

const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
} = require('../controllers/book.controller');

const bookValidation = require('../validators/book.validator');
const validate = require('../middleware/validation.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getAllBooks);

router.get('/:id', getBookById);

router.post(
    '/',
    upload.single('image'),
    bookValidation,
    validate,
    addBook
);

router.patch('/:id', updateBook);

router.delete('/:id', deleteBook);

module.exports = router;