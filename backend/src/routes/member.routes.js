const express = require('express');

const {
    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember
} = require('../controllers/member.controller');

const router = express.Router();

router.get('/', getAllMembers);

router.get('/:id', getMemberById);

router.post('/', addMember);

router.patch('/:id', updateMember);

router.delete('/:id', deleteMember);

module.exports = router;