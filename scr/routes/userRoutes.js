const express = require('express');
const Users = require('../modules/users.js');
const uuid = require('uuid');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { user_name, password, about, wallet_address } = req.body;  // Get the data from the request's body
        const id = await Users.create(user_name, password, about, wallet_address);
        console.log('User created successfully!',id);
        res.status(201).json({ message: 'User created successfully!', user_id: id});
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to get users:', error);
        res.status(500).json({ message: 'Failed to get users' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findById(id);
        if(user.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user[0]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user' });
    }
});

module.exports = router;