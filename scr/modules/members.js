// models/Members.js
/*
CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    status  int,
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

import createLocalClient from '../utils/astraDB.js';

class Members {
    static async find(userId, community_id) {
        const astraClient = await createLocalClient();
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
        const astraClient = await createLocalClient();

        // Check if user already exists in community
        const checkQuery = 'SELECT * FROM Members WHERE community_id = ? AND user_id = ?';
        const checkParams = [community_id, user_id];
        const checkResult = await astraClient.execute(checkQuery, checkParams);

        if(checkResult.rows.length > 0){
            // User already exists, so update status to 1
            const updateQuery = 'UPDATE Members SET status = ? WHERE community_id = ? AND user_id = ?';
            const updateParams = [1, community_id, user_id];
            await astraClient.execute(updateQuery, updateParams);
        } else {
            // User doesn't exist, so insert new record
            const insertQuery = 'INSERT INTO Members (community_id, user_id, status, seniority) VALUES (?, ?, ?, ?)';
            const insertParams = [community_id, user_id, 1, 0];
            await astraClient.execute(insertQuery, insertParams);
        }
    }

    static async throwOut(community_id, user_id) {
        const astraClient = await createLocalClient();
        const query = 'UPDATE Members SET status = ? WHERE community_id = ? AND user_id = ?';
        const params = [2, community_id, user_id]; // 2 is status for thrown out
        await astraClient.execute(query, params);
    }

    static async fetchMembershipProposal(userId) {
        const astraClient = await createLocalClient();
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
        const astraClient = await createLocalClient();
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
        const astraClient = await createLocalClient();
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
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority >= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async seniorityLTE(community_id, seniority) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Members WHERE community_id = ? AND seniority <= ?';
        const params = [community_id, seniority];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }
}
export default Members;
