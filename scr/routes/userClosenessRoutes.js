const express = require('express');
const router = express.Router();
const UserCloseness = require('../modules/user_closeness'); // Assuming the relative path to the UserCloseness class

// Calculate closeness between two users
router.get('/calc/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const closeness = await UserCloseness.calc(userId, otherUserId);
        res.status(200).json({closeness});
    } catch (error) {
        console.error('Failed to calculate user closeness:', error);
        res.status(500).json({ message: 'Failed to calculate user closeness' });
    }
});

// Find a UserCloseness by userId and otherUserId
router.get('/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const userCloseness = await UserCloseness.find(userId, otherUserId);
        res.status(200).json(userCloseness);
    } catch (error) {
        console.error('Failed to find UserCloseness:', error);
        res.status(500).json({ message: 'Failed to find UserCloseness' });
    }
});

module.exports = router;
