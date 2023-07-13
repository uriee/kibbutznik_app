// models/Vote.js
/*
CREATE TABLE IF NOT EXISTS Votes (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    vote int,
    PRIMARY KEY ((user_id), proposal_id)
);
*/
const createAstraClient = require('../path_to_your_file');

class Vote {
    static async create(vote) {
        const astraClient = await createAstraClient();
        // assuming `vote` is an object with fields: user_id, community_id, proposal_id, vote
        const query = 'INSERT INTO Votes (user_id, community_id, proposal_id, vote) VALUES (?, ?, ?, ?)';
        const params = [vote.user_id, vote.community_id, vote.proposal_id, vote.vote];
        await astraClient.execute(query, params);
    }

    static async delete(proposalId) {
        const astraClient = await createAstraClient();
        const query = 'DELETE FROM Votes WHERE AND proposal_id = ?';
        const params = [proposalId];
        await astraClient.execute(query, params);
    }

    static async getVotes(userId, communityId, proposalId) {
        if (!userId && !communityId && !proposalId) {
            return null;
        }

        const astraClient = await createAstraClient();
        let query = 'SELECT * FROM Votes WHERE';
        let params = [];
        let conditions = [];

        if (userId) {
            conditions.push('user_id = ?');
            params.push(userId);
        }
        if (communityId) {
            conditions.push('community_id = ?');
            params.push(communityId);
        }
        if (proposalId) {
            conditions.push('proposal_id = ?');
            params.push(proposalId);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await astraClient.execute(query, params);
        return result.rows;
    }
    
}

module.exports = Vote;
