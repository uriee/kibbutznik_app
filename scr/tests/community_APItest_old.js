const { v4: uuidV4 } = require('uuid');  // use 'uuid' package for generating uuid
const axios = require('axios'); // make sure axios is required

async function testCreateCommunity() {
    try {
        const newCommunity = {
            parent_community_id: '00000000-0000-0000-0000-000000000000', 
            name: 'TestCommunity',
            user_id: uuidV4('54d14c5b-c05e-4e1b-8c8c-8608dc3541c5'),
        };
        console.log("11", newCommunity)
        const response = await axios.post('http://localhost:3000/communities/creatWithUser', newCommunity);
        console.log('Community created successfully:', response.data);
        const communityId = response.data.community_id;
        await testGetCommunityById(communityId);
    } catch (error) {
        console.error('Failed to create community:');
    }
}

async function testGetCommunityById(communityId) {
    try {
        const response = await axios.get(`http://localhost:3000/communities/${communityId}`);
        console.log(`Community with id ${communityId}:`, response.data);
    } catch (error) {
        console.error(`Failed to get community with id ${communityId}:`, error);
    }
}

testCreateCommunity();