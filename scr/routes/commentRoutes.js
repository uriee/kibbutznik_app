const express = require('express');
const router = express.Router();
const Comments = require('../modules/comments'); // Assuming the relative path to the Comments class

// Add a comment
router.post('/', async (req, res) => {
    try {
        const { commentId, parentCommentId, entityId, entityType, userId, commentText } = req.body;
        await Comments.addComment(commentId, parentCommentId, entityId, entityType, userId, commentText);
        res.status(201).json({ message: 'Comment added successfully!' });
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});

// Get comments for an entity
router.get('/', async (req, res) => {
    try {
        const { entityId, entityType } = req.query;
        const comments = await Comments.getComments(entityId, entityType);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Failed to get comments:', error);
        res.status(500).json({ message: 'Failed to get comments' });
    }
});

// Update comment score
router.put('/:commentId/score', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { newScore } = req.body;
        await Comments.updateScore(commentId, newScore);
        res.status(200).json({ message: 'Comment score updated successfully!' });
    } catch (error) {
        console.error('Failed to update comment score:', error);
        res.status(500).json({ message: 'Failed to update comment score' });
    }
});

// Increment comment score
router.patch('/:commentId/incrementScore', async (req, res) => {
    try {
        const { commentId } = req.params;
        await Comments.incrementScore(commentId);
        res.status(200).json({ message: 'Comment score incremented successfully!' });
    } catch (error) {
        console.error('Failed to increment comment score:', error);
        res.status(500).json({ message: 'Failed to increment comment score' });
    }
});

// Decrement comment score
router.patch('/:commentId/decrementScore', async (req, res) => {
    try {
        const { commentId } = req.params;
        await Comments.decrementScore(commentId);
        res.status(200).json({ message: 'Comment score decremented successfully!' });
    } catch (error) {
        console.error('Failed to decrement comment score:', error);
        res.status(500).json({ message: 'Failed to decrement comment score' });
    }
});

module.exports = router;
