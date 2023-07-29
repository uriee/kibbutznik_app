const express = require('express');
const Proposals = require('../modules/proposals.js');
const uuid = require('uuid');
const router = express.Router();


// Create a proposal
router.post('', async (req, res) => {
    try {
        const { community_id, proposal_text, proposal_status, proposal_type, proposal_support } = req.body;
        const newProposal = {
            proposal_id: uuid.v4(),
            community_id: community_id,
            proposal_text: proposal_text,
            proposal_status: proposal_status,
            proposal_type: proposal_type,
            proposal_support: proposal_support,
            age: 0
        };

        await Proposals.create(newProposal);
        console.log('Proposal created successfully!');
        res.status(201).json({ message: 'Proposal created successfully!', proposal_id: newProposal.proposal_id });
    } catch (error) {
        console.error('Failed to create proposal:', error);
        res.status(500).json({ message: 'Failed to create proposal' });
    }
});
// Delete a proposal
router.delete('/:proposalId', async (req, res) => {
    try {
        await Proposals.delete(req.params.proposalId);
        res.status(200).send('Proposal deleted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Find a proposal by id
router.get('/:proposalId', async (req, res) => {
    try {
        const proposal = await Proposals.findById(req.params.proposalId);
        res.status(200).json(proposal);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all proposals
router.get('/', async (req, res) => {
    try {
        const proposals = await Proposals.find();
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Find proposals by type
router.get('/type/:proposalType', async (req, res) => {
    try {
        const proposals = await Proposals.findByType(req.params.proposalType);
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Find proposals by pulse
router.get('/pulse/:pulseId', async (req, res) => {
    try {
        const proposals = await Proposals.findProposalsByPulse(req.params.pulseId);
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Count votes for a proposal
router.get('/:proposalId/votes', async (req, res) => {
    try {
        const count = await Proposals.countVotes(req.params.proposalId);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Count support for a proposal
router.get('/:proposalId/support', async (req, res) => {
    try {
        const count = await Proposals.countSupport(req.params.proposalId);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports =  router;