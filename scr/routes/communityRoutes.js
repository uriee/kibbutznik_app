
const express = require('express');
const Communities = require('../modules/communities.js'); // update path as needed
const uuid = require('uuid');
const router = express.Router();

router.get('/communities/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const community = await Communities.findById(id);
        if(community.length === 0) {
            res.status(404).json({ message: 'Community not found' });
        } else {
            res.status(200).json(community[0]);
        }
    } catch (error) {
        console.error('Failed to get community:', error);
        res.status(500).json({ message: 'Failed to get community' });
    }
});

router.post('/communities', async (req, res) => {
    try {
        const { parent_community_id, name } = req.body;
        const community_id = await Communities.create(parent_community_id, name);
        console.log('Community created successfully!');
        res.status(201).json({ message: 'Community created successfully!', community_id: community_id });
    } catch (error) {
        console.error('Failed to create community:', error);
        res.status(500).json({ message: 'Failed to create community' });
    }
});

router.get('/communities/:id/parents', async (req, res) => {
    try {
        const id = req.params.id;
        const parents = await Communities.getParentsTree(id);
        res.status(200).json(parents);
    } catch (error) {
        console.error('Failed to get parents:', error);
        res.status(500).json({ message: 'Failed to get parents' });
    }
});

router.get('/communities/:id/members', async (req, res) => {
    try {
        const id = req.params.id;
        const members = await Communities.getMembers(id);
        res.status(200).json(members);
    } catch (error) {
        console.error('Failed to get members:', error);
        res.status(500).json({ message: 'Failed to get members' });
    }
});


router.get('/communities/:id/children', async (req, res) => {
    try {
        const id = req.params.id;
        const children = await Communities.getChildrenTree(id);
        res.status(200).json(children);
    } catch (error) {
        console.error('Failed to get children:', error);
        res.status(500).json({ message: 'Failed to get children' });
    }
});

router.get('/communities/:id/parent/:parentId', async (req, res) => {
    try {
        const { id, parentId } = req.params;
        const isParent = await Communities.isParentOf(parentId, id);
        res.status(200).json({ isParent });
    } catch (error) {
        console.error('Failed to check if parent:', error);
        res.status(500).json({ message: 'Failed to check if parent' });
    }
});

router.get('/communities/:id/child/:childId', async (req, res) => {
    try {
        const { id, childId } = req.params;
        const isChild = await Communities.isChildOf(childId, id);
        res.status(200).json({ isChild });
    } catch (error) {
        console.error('Failed to check if child:', error);
        res.status(500).json({ message: 'Failed to check if child' });
    }
});

router.get('/communities/:id/statements', async (req, res) => {
    try {
        const id = req.params.id;
        const statements = await Communities.getStatements(id);
        res.status(200).json(statements);
    } catch (error) {
        console.error('Failed to get statements:', error);
        res.status(500).json({ message: 'Failed to get statements' });
    }
});

router.get('/communities/:id/proposals', async (req, res) => {
    try {
        const id = req.params.id;
        const proposals = await Communities.getProposals(id);
        res.status(200).json(proposals);
    } catch (error) {
        console.error('Failed to get proposals:', error);
        res.status(500).json({ message: 'Failed to get proposals' });
    }
});

router.get('/communities/:id/balance', async (req, res) => {
    try {
        const id = req.params.id;
        const balance = await Communities.getCommunityBalance(id);  
        res.status(200).json({ balance });
    } catch (error) {
        console.error('Failed to get balance:', error);
        res.status(500).json({ message: 'Failed to get balance' });
    }
});

module.exports = router;