const express = require('express');
const router = express.Router();
const PulseSupport = require('../models/pulseSupport'); // Assuming the relative path to the PulseSupport class

// Create a PulseSupport
router.post('/pulseSupport', async (req, res) => {
    try {
        const { community_id, user_id } = req.body;
        await PulseSupport.create(community_id, user_id);
        res.status(201).json({ message: 'PulseSupport added successfully!' });
    } catch (error) {
        console.error('Failed to add PulseSupport:', error);
        res.status(500).json({ message: 'Failed to add PulseSupport' });
    }
});

// Delete a PulseSupport
router.delete('/pulseSupport/:userId/:pulseId', async (req, res) => {
    try {
        const { userId, pulseId } = req.params;
        await PulseSupport.delete(userId, pulseId);
        res.status(200).json({ message: 'PulseSupport deleted successfully!' });
    } catch (error) {
        console.error('Failed to delete PulseSupport:', error);
        res.status(500).json({ message: 'Failed to delete PulseSupport' });
    }
});

// Get a PulseSupport by pulseId and userId
router.get('/pulseSupport/:pulseId/:userId', async (req, res) => {
    try {
        const { pulseId, userId } = req.params;
        const pulseSupport = await PulseSupport.findByPulseIdAndUserId(pulseId, userId);
        res.status(200).json(pulseSupport);
    } catch (error) {
        console.error('Failed to get PulseSupport:', error);
        res.status(500).json({ message: 'Failed to get PulseSupport' });
    }
});

// Get PulseSupport count for a community
router.get('/pulseSupportCount/:communityId', async (req, res) => {
    try {
        const { communityId } = req.params;
        const count = await PulseSupport.countPulseSupport(communityId);
        res.status(200).json({count});
    } catch (error) {
        console.error('Failed to get pulse support count:', error);
        res.status(500).json({ message: 'Failed to get pulse support count' });
    }
});

module.exports = router;
