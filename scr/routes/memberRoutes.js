const express = require('express');
const router = express.Router();
const Members = require('../modules/members');

router.get('/:userId', async (req, res) => {
    try {
        const { userId, communityId } = req.params;
        const member = await Members.find(userId, communityId);
        res.status(200).json(member);
    } catch (error) {
        console.error('Failed to find member:', error);
        res.status(500).json({ message: 'Failed to find member' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, communityId } = req.body;
        await Members.create(userId, communityId);
        res.status(200).json({ message: 'Member created or updated' });
    } catch (error) {
        console.error('Failed to create member:', error);
        res.status(500).json({ message: 'Failed to create member' });
    }
});

router.get('/:userId/proposals', async (req, res) => {
    try {
        const { userId } = req.params;
        const proposals = await Members.fetchMembershipProposal(userId);
        res.status(200).json(proposals);
    } catch (error) {
        console.error('Failed to get proposals:', error);
        res.status(500).json({ message: 'Failed to get proposals' });
    }
});

router.get('/:userId/support', async (req, res) => {
    try {
        const { userId, communityId } = req.params;
        const supportedProposals = await Members.getSupportedProposals(userId, communityId);
        res.status(200).json(supportedProposals);
    } catch (error) {
        console.error('Failed to get supported proposals:', error);
        res.status(500).json({ message: 'Failed to get supported proposals' });
    }
});

router.get('/:userId/votes', async (req, res) => {
    try {
        const { userId, communityId } = req.params;
        const votedProposals = await Members.getVotedProposals(userId, communityId);
        res.status(200).json(votedProposals);
    } catch (error) {
        console.error('Failed to get voted proposals:', error);
        res.status(500).json({ message: 'Failed to get voted proposals' });
    }
});

router.get('/:communityId/seniority/gte/:seniority', async (req, res) => {
    try {
        const { communityId, seniority } = req.params;
        const members = await Members.seniorityGTE(communityId, seniority);
        res.status(200).json(members);
    } catch (error) {
        console.error('Failed to get members with seniority greater than or equal to:', error);
        res.status(500).json({ message: 'Failed to get members with seniority greater than or equal to' });
    }
});

router.get('/:communityId/seniority/lte/:seniority', async (req, res) => {
    try {
        const { communityId, seniority } = req.params;
        const members = await Members.seniorityLTE(communityId, seniority);
        res.status(200).json(members);
    } catch (error) {
        console.error('Failed to get members with seniority less than or equal to:', error);
        res.status(500).json({ message: 'Failed to get members with seniority less than or equal to' });
    }
});

module.exports = router;