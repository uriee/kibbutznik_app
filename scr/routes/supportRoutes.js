const express = require('express');
const router = express.Router();
const Support = require('../modules/support');

// Create support
router.post('/supports', async (req, res) => {
    try {
        const { user_id, proposal_id, support } = req.body;  // Get the data from the request's body
        await Support.create(user_id, proposal_id, support);
        res.status(201).json({ message: 'Support created successfully!' });
    } catch (error) {
        console.error('Failed to create support:', error);
        res.status(500).json({ message: 'Failed to create support' });
    }
});

// Delete support
router.delete('/supports/:userId/:proposalId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const proposalId = req.params.proposalId;
        await Support.delete(userId, proposalId);
        res.status(200).json({ message: 'Support deleted successfully!' });
    } catch (error) {
        console.error('Failed to delete support:', error);
        res.status(500).json({ message: 'Failed to delete support' });
    }
});

// Find support by proposal ID and user ID
router.get('/supports/:proposalId/:userId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const supports = await Support.findByProposalIdAndUserId(proposalId, userId);
        res.status(200).json({ supports: supports });
    } catch (error) {
        console.error('Failed to find support:', error);
        res.status(500).json({ message: 'Failed to find support' });
    }
});

// Count support
router.get('/supports/count/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const counts = await Support.countSupport(proposalId);
        res.status(200).json({ counts: counts });
    } catch (error) {
        console.error('Failed to count support:', error);
        res.status(500).json({ message: 'Failed to count support' });
    }
});

module.exports = router;
