const express = require('express');
const router = express.Router();
const Pulses = require('./pulses');

// Get pulse id by status
router.get('/pulses/:communityId/:pulseStatus', async (req, res) => {
    try {
        const communityId = req.params.communityId;
        const pulseStatus = req.params.pulseStatus;
        const pulseId = await Pulses.pulseIdByStatus(communityId, pulseStatus);
        res.status(200).json({ pulse_id: pulseId });
    } catch (error) {
        console.error('Failed to get pulse id:', error);
        res.status(500).json({ message: 'Failed to get pulse id' });
    }
});

// Find active pulses
router.get('/pulses/active', async (req, res) => {
    try {
        const activePulses = await Pulses.findActive();
        res.status(200).json({ active_pulses: activePulses });
    } catch (error) {
        console.error('Failed to get active pulses:', error);
        res.status(500).json({ message: 'Failed to get active pulses' });
    }
});

module.exports = router;
