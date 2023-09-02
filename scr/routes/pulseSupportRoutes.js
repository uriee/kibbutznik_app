const express = require('express');
const router = express.Router();
const PulseSupport = require('../modules/pulse_supports'); // Assuming the relative path to the PulseSupport class
const { findProposalsByPulse } = require('../modules/proposals');

// Create a PulseSupport
router.post('/', async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const { community_id, user_id} = req.body;
        const pulse_id = await PulseSupport.create(community_id, user_id);
        res.status(201).json({ message: 'PulseSupport added successfully!' ,pulse_id : pulse_id });
    } catch (error) {
        console.error('Failed to add PulseSupport:', error);
        res.status(500).json({ message: 'Failed to add PulseSupport' });
    }
});

// Delete a PulseSupport
router.delete('/:communityId/:userId', async (req, res) => {

    const community_id = req.params.communityId;
    const user_id= req.params.userId;
    await PulseSupport.delete(community_id,user_id);
    res.status(200).json({ message: 'PulseSupport deleted successfully!' });

});

// Get PulseSupport count for a community
router.get('/count/:pulseId', async (req, res) => {
    try {
        const { pulseId } = req.params;
        const count = await PulseSupport.get_support(pulseId);
        res.status(200).json({count});
    } catch (error) {
        console.error('Failed to get pulse support count:', error);
        res.status(500).json({ message: 'Failed to get pulse support count' });
    }
});

// Get a PulseSupport by pulseId and userId
router.get('/:pulseId/:userId', async (req, res) => {
    try {
        const { pulseId, userId } = req.params;
        const pulseSupport = await PulseSupport.findByPulseIdAndUserId(pulseId, userId);
        res.status(200).json(pulseSupport);
    } catch (error) {
        console.error('Failed to get PulseSupport:', error);
        res.status(500).json({ message: 'Failed to get PulseSupport' });
    }
});

module.exports = router;
