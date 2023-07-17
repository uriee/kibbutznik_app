const express = require('express');
const router = express.Router();
const Vote = require('../modules/vote'); // Assuming the relative path to the Vote class

// Add a vote
router.post('/votes', async (req, res) => {
    try {
        const { user_id, community_id, proposal_id, vote } = req.body;
        await Vote.create(user_id, community_id, proposal_id, vote);
        res.status(201).json({ message: 'Vote added successfully!' });
    } catch (error) {
        console.error('Failed to add vote:', error);
        res.status(500).json({ message: 'Failed to add vote' });
    }
});

// Delete votes for a proposal
router.delete('/votes/:proposalId', async (req, res) => {
    try {
        const { proposalId } = req.params;
        await Vote.delete(proposalId);
        res.status(200).json({ message: 'Votes for the proposal deleted successfully!' });
    } catch (error) {
        console.error('Failed to delete votes:', error);
        res.status(500).json({ message: 'Failed to delete votes' });
    }
});

// Get votes for a specific user, community, and proposal
router.get('/votes', async (req, res) => {
    try {
        const { userId, communityId, proposalId } = req.query;
        const votes = await Vote.getVotes(userId, communityId, proposalId);
        res.status(200).json(votes);
    } catch (error) {
        console.error('Failed to get votes:', error);
        res.status(500).json({ message: 'Failed to get votes' });
    }
});

module.exports = router;
