const express = require('express');
const router = express.Router();
const Support = require('../modules/supports');

// Create support
router.post('/', async (req, res) => {
    try {
        
        const { user_id, proposal_id, support } = req.body;  // Get the data from the request's body
        console.log("__________1",req.body);
        await Support.create(user_id, proposal_id, support);
        res.status(201).json({ message: 'Support created successfully!' });
    } catch (error) {
        console.error('Failed to create support:', error);
        res.status(500).json({ message: 'Failed to create support' });
    }
});

// Delete support
router.delete('/:userId/:proposalId', async (req, res) => {
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

router.get('/byuser/:userId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const supports = await Support.find(userId, null);
        res.status(200).json({ supports: supports });
    } catch (error) {
        console.error('Failed to find support:', error);
        res.status(500).json({ message: 'Failed to find support' });
    }
});

router.get('/byproposal/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const supports = await Support.find(null, proposalId);
        console.log("4312",supports)
        res.status(200).json({ supports: supports });
    } catch (error) {
        console.error('Failed to find support:', error);
        res.status(500).json({ message: 'Failed to find support' });
    }
});

// Find support by proposal ID and user ID
router.get('/count/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const supports = await Support.get_count(proposalId);
        console.log("4312",supports)
        res.status(200).json({ supports: supports });
    } catch (error) {
        console.error('Failed to find support:', error);
        res.status(500).json({ message: 'Failed to find support' });
    }
});

// Find support by proposal ID and user ID
router.get('/:userId/:proposalId', async (req, res) => {
    try {
        const proposalId = req.params.proposalId;
        const userId = req.params.userId;
        const supports = await Support.find(userId, proposalId);
        console.log("4312",supports)
        res.status(200).json({ supports: supports });
    } catch (error) {
        console.error('Failed to find support:', error);
        res.status(500).json({ message: 'Failed to find support' });
    }
});


module.exports = router;
