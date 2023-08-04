// ./test.js
const axios = require('axios');

async function testCreateUser() {
    try {
        const newUser = {
            user_name: 'TestUser1',
            password: 'TestPassword',
            about: 'This is a test user',
            wallet_address: 'TestWalletAddress',
        };
        const response = await axios.post('http://localhost:3000/users', newUser);
        console.log('User created successfully:', response.data);


    } catch (error) {
        console.error('Failed to create user:', error);
    }
}

async function testGetAllUsers() {
    try {
        const response = await axios.get('http://localhost:3000/users');
        console.log('All users:', response.data);
    } catch (error) {
        console.error('Failed to get all users:');
    }
}

async function testGetUserById(userId) {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        console.log(`User with id ${userId}:`, response.data);
    } catch (error) {
        console.error(`Failed to get user with id ${userId}:`);
    }
}


testGetUserById('a41dff60-6040-415a-82b3-9ff043602687');

testGetAllUsers()