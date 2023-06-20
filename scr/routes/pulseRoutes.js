const express = require('express');
const router = express.Router();
const pulseController = require('../controllers/pulseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all pulses
router.get('/', authMiddleware.protect, pulseController.getAllPulses);

// Get a single pulse by id
router.get('/:id', authMiddleware.protect, pulseController.getPulse);

// Create a new pulse
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), pulseController.createPulse);

// Update a pulse
router.patch('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), pulseController.updatePulse);

// Delete a pulse
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), pulseController.deletePulse);

module.exports = router;