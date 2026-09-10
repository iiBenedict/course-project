const { body } = require('express-validator');

const bookValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),

    body('author')
        .trim()
        .notEmpty()
        .withMessage('Author is required'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),

    body('isbn')
        .trim()
        .notEmpty()
        .withMessage('ISBN is required'),

    body('publishedYear')
        .isInt()
        .withMessage('Published year must be a number')
];

module.exports = bookValidation;