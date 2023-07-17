// ./test.js
const axios = require('axios');

async function testCreateUser() {
    try {
        const newUser = {
            user_name: 'TestUser',
            password: 'TestPassword',
            about: 'This is a test user',
            wallet_address: 'TestWalletAddress',
        };
        const response = await axios.post('http://localhost:3000/users', newUser);
        console.log('User created successfully:', response.data);

        // Use the user_id from the created user to make GET requests
        const userId = response.data.user_id;
        await testGetUserById(userId);
        await testGetAllUsers();

    } catch (error) {
        console.error('Failed to create user:', error);
    }
}

async function testGetAllUsers() {
    try {
        const response = await axios.get('http://localhost:3000/users');
        console.log('All users:', response.data);
    } catch (error) {
        console.error('Failed to get all users:', error);
    }
}

async function testGetUserById(userId) {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        console.log(`User with id ${userId}:`, response.data);
    } catch (error) {
        console.error(`Failed to get user with id ${userId}:`, error);
    }
}

testGetAllUsers();