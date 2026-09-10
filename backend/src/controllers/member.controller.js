const Member = require('../models/Member');

const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });

        res.json(members);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get members'
        });
    }
};

const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                message: 'Member not found'
            });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get member'
        });
    }
};

const addMember = async (req, res) => {
    try {
        const member = await Member.create(req.body);

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add member',
            error: error.message
        });
    }
};

const updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!member) {
            return res.status(404).json({
                message: 'Member not found'
            });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update member'
        });
    }
};

const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({
                message: 'Member not found'
            });
        }

        res.json({
            message: 'Member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete member'
        });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember
};