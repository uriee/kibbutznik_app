const express = require('express');
const router = express.Router();
const Vote = require('../modules/votes'); // Assuming the relative path to the Vote class

// Add a vote
router.post('/', async (req, res) => {
    try {
        const { user_id, proposal_id } = req.body;
        await Vote.create(user_id, proposal_id);
        res.status(201).json({ message: 'Vote added successfully!' });
    } catch (error) {
        console.error('Failed to add vote:', error);
        res.status(500).json({ message: 'Failed to add vote' });
    }
});


router.delete('/:userId/:proposalId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const proposalId = req.params.proposalId;
        await Vote.delete(userId, proposalId);
        res.status(200).json({ message: 'Vote deleted successfully!' });
    } catch (error) {
        console.error('Failed to delete Vote:', error);
        res.status(500).json({ message: 'Failed to delete Vote' });
    }
});

router.get('/byuser/:userId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const vote = await Vote.find(userId, null);
        console.log("431212",vote)
        res.status(200).json({ vote: vote });
    } catch (error) {
        console.error('Failed to find vote:', error);
        res.status(500).json({ message: 'Failed to find vote' });
    }
});

router.get('/byproposal/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const vote = await Vote.find(null, proposalId);
        console.log("4312",vote)
        res.status(200).json({ vote: vote });
    } catch (error) {
        console.error('Failed to find vote:', error);
        res.status(500).json({ message: 'Failed to find vote' });
    }
});

// Find vote by proposal ID and user ID
router.get('/count/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const vote = await Vote.get_count(proposalId);
        console.log("4312",vote)
        res.status(200).json({ vote: vote });
    } catch (error) {
        console.error('Failed to find vote:', error);
        res.status(500).json({ message: 'Failed to find vote' });
    }
});

// Find vote by proposal ID and user ID
router.get('/:userId/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const vote = await Vote.find(userId, proposalId);
        console.log("4312",vote)
        res.status(200).json({ vote: vote });
    } catch (error) {
        console.error('Failed to find vote:', error);
        res.status(500).json({ message: 'Failed to find vote' });
    }
});

module.exports = router;
