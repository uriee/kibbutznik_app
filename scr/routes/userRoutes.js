const express = require('express');
const Users = require('../modules/users.js');
const uuid = require('uuid');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { user_name, password, about, wallet_address } = req.body;  // Get the data from the request's body
        const newUser = {
            user_id: uuid.v4(),  // Generate a new UUID
            user_name: user_name, 
            password: password,
            about: about,
            wallet_address: wallet_address
        };

        await Users.create(newUser);
        console.log('User created successfully!');
        res.status(201).json({ message: 'User created successfully!', user_id: newUser.user_id });
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
        console.error('Failed to get user:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
});

module.exports = router;