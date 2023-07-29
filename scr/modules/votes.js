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
const DBClient = require('../utils/localDB.js');

class Vote {
    static async create(user_id,community_id, proposal_id, vote) {
       const db = DBClient.getInstance();
        // assuming `vote` is an object with fields: user_id, community_id, proposal_id, vote
        const query = 'INSERT INTO Votes (user_id, community_id, proposal_id, vote) VALUES (?, ?, ?, ?)';
        const params = [user_id, community_id, proposal_id, vote];
        await db.execute(query, params, { hints : ['uuid', 'uuid', 'uuid', 'int']});
    }

    static async delete(proposalId) {
       const db = DBClient.getInstance();
        const query = 'DELETE FROM Votes WHERE AND proposal_id = ?';
        const params = [proposalId];
        await db.execute(query, params);
    }

    static async getVotes(userId, communityId, proposalId) {
        if (!userId && !communityId && !proposalId) {
            return null;
        }

       const db = DBClient.getInstance();
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

        const result = await db.execute(query, params);
        return result.rows;
    }
    
}

module.exports = Vote;
