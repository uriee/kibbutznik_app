async function testCreateCommunity() {
    try {
        const newCommunity = {
            parent_community_id: 'parentId', // Use actual parentId
            name: 'TestCommunity',
        };
        const response = await axios.post('http://localhost:3000/communities', newCommunity);
        console.log('Community created successfully:', response.data);
        const communityId = response.data.community_id;
        await testGetCommunityById(communityId);
    } catch (error) {
        console.error('Failed to create community:', error);
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