const express = require('express');

const {
    getAllLoans,
    createLoan,
    returnLoan
} = require('../controllers/loan.controller');

const router = express.Router();

router.get('/', getAllLoans);

router.post('/', createLoan);

router.patch('/:id/return', returnLoan);

module.exports = router;