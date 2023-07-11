// models/Members.js
/*
CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    seniority int,
    PRIMARY KEY ((community_id), user_id)
);

CREATE TABLE IF NOT EXISTS Membership_Proposals (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    PRIMARY KEY ((user_id), proposal_id)
);
*/
const createAstraClient = require('../path_to_your_file');

class Members {
    static async find(userId, community_id) {
        const astraClient = await createAstraClient();
        let query, params;

        if(community_id) {
            query = 'SELECT * FROM Members WHERE user_id = ? AND community_id = ?';
            params = [userId, community_id];
        } else {
            query = 'SELECT * FROM Members WHERE user_id = ?';
            params = [userId];
        }
        
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(user_id, community_id) {
        const astraClient = await createAstraClient();
        // assuming `member` is an object with fields: community_id, user_id, seniority
        const query = 'INSERT INTO Members (community_id, user_id, seniority) VALUES (?, ?, ?)';
        const params = [community_id, user_id, 0];
        await astraClient.execute(query, params);
    }

    static async fetchMembershipProposal(userId) {
        const astraClient = await createAstraClient();
        const proposalQuery = 'SELECT proposal_id FROM Membership_Proposals WHERE user_id = ?';
        const proposalParams = [userId];
        const proposalResult = await astraClient.execute(proposalQuery, proposalParams);
        
        // Assuming there is only one proposal per user.
        // If there are multiple proposals for a user, you would need to handle that case.
        const proposalId = proposalResult.rows[0].proposal_id;

        const detailedQuery = 'SELECT * FROM Proposals WHERE proposal_id = ?';
        const detailedParams = [proposalId];
        const detailedResult = await astraClient.execute(detailedQuery, detailedParams);
        return detailedResult.rows;
    }

    static async getSupportedProposals(userId, communityId = null) {
        const astraClient = await createAstraClient();
        let query = 'SELECT * FROM Support WHERE user_id = ?';
        let params = [userId];
        if(communityId) {
            query += ' AND community_id = ?';
            params.push(communityId);
        }
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getVotedProposals(userId, communityId = null) {
        const astraClient = await createAstraClient();
        let query = 'SELECT * FROM Votes WHERE user_id = ?';
        let params = [userId];
        if(communityId) {
            query += ' AND community_id = ?';
            params.push(communityId);
        }
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async seniorityGTE(community_id, seniority) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority >= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async seniorityLTE(community_id, seniority) {
        const astraClient = await createAstraClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority <= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}
module.exports = Members;
