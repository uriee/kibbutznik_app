const express = require('express');
const Proposals = require('../modules/proposals.js');
const uuid = require('uuid');
const router = express.Router();


// Create a proposal
router.post('/', async (req, res) => {
    try {
        const { community_id, user_id, proposal_type, proposal_text, val_uuid, val_text } = req.body;
        console.log("rrrr",req.body)
        const proposal_id = await Proposals.create(community_id, user_id, proposal_type, proposal_text, val_uuid, val_text, true);
        console.log('Proposal created successfully!', proposal_id);
        res.status(201).json({ message: 'Proposal created successfully!', proposal_id: proposal_id});
    } catch (error) {
        console.error('Failed to create proposal:', error);
        res.status(500).json({ message: 'Failed to create proposal' });
    }
});

// Update Status of a Proposal
router.put('/status', async (req, res) => {
    try {
        console.log("qwer",req.body)
        await Proposals.UpdateStatus(req.body.proposal_id, req.body.direction);
        res.status(200).send(`Status updated for proposal with ID: ${req.body.proposal_id}`);
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
router.get('/:communityId/:proposalStatus/:proposalType', async (req, res) => {
    console.log("Good",req.params.communityId, req.params.proposalStatus, req.params.proposalType)
    const proposalStatus = req.params.proposalStatus == '0' ? null : req.params.proposalStatus
    const proposalType = req.params.proposalStatus == '0' ? null : req.params.proposalType
    try {
        const proposals = await Proposals.find(req.params.communityId, proposalStatus , proposalType );
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

router.post('/execute/:proposal_id', async (req, res) => {
    try {
        const result = await Proposals.executeProposal(req.params.proposal_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports =  router;