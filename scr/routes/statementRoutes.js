const express = require('express');
const router = express.Router();
const Statements = require('./statements');

// Find statements by community id
router.get('/statements/community/:id', async (req, res) => {
    try {
        const communityId = req.params.id;
        const statements = await Statements.findByCommunityId(communityId);
        res.status(200).json({ statements: statements });
    } catch (error) {
        console.error('Failed to get statements:', error);
        res.status(500).json({ message: 'Failed to get statements' });
    }
});

// Find statements by text substring
router.get('/statements/search/:substring', async (req, res) => {
    try {
        const substring = req.params.substring;
        const statements = await Statements.findByTextSubstring(substring);
        res.status(200).json({ statements: statements });
    } catch (error) {
        console.error('Failed to get statements:', error);
        res.status(500).json({ message: 'Failed to get statements' });
    }
});

// Create a new statement
router.post('/statements', async (req, res) => {
    try {
        const { community_id, statement_text } = req.body;
        const newStatement = { community_id: community_id, statement_text: statement_text };

        await Statements.create(newStatement);
        console.log('Statement created successfully!');
        res.status(201).json({ message: 'Statement created successfully!', statement: newStatement });
    } catch (error) {
        console.error('Failed to create statement:', error);
        res.status(500).json({ message: 'Failed to create statement' });
    }
});

module.exports = router;
