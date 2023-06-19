const express = require('express');
const communityController = require('../controllers/communityController');
const router = express.Router();

// Route to get a community by id
router.get('/community/:id', communityController.getCommunity);

// Route to create a new community
router.post('/community', communityController.createCommunity);

// Route to get the parent communities of a community
router.get('/community/:id/parent', communityController.getParents);

// Route to get the children communities of a community
router.get('/community/:id/children', communityController.getChildren);

// Route to check if a community is a parent of another
router.get('/community/:parent_id/is_parent_of/:child_id', communityController.checkIsParentOf);

// Route to check if a community is a child of another
router.get('/community/:child_id/is_child_of/:parent_id', communityController.checkIsChildOf);

module.exports = router;